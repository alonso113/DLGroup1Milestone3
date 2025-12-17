package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"backend/internal/models"
)

// Current model version for tracking predictions
const ModelVersion = "v1.0.0"

// FirestoreService handles database operations
type FirestoreService struct {
	projectID string
}

// NewFirestoreService creates a new Firestore service
// No credentials needed when Firestore rules allow public access
func NewFirestoreService() (*FirestoreService, error) {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		projectID = "deeplearningmilestone3"
	}

	return &FirestoreService{
		projectID: projectID,
	}, nil
}

func toFirestoreFields(article *models.Article) map[string]interface{} {
	return map[string]interface{}{
		"title":            map[string]interface{}{"stringValue": article.Title},
		"content":          map[string]interface{}{"stringValue": article.Content},
		"url":              map[string]interface{}{"stringValue": article.URL},
		"source":           map[string]interface{}{"stringValue": article.Source},
		"author":           map[string]interface{}{"stringValue": article.Author},
		"published_at":     map[string]interface{}{"timestampValue": article.PublishedAt.Format(time.RFC3339Nano)},
		"submitted_at":     map[string]interface{}{"timestampValue": time.Now().Format(time.RFC3339Nano)},
		"fire_score":       map[string]interface{}{"integerValue": article.FIREScore.OverallScore},
		"model_version":    map[string]interface{}{"stringValue": ModelVersion},
		"needs_moderation": map[string]interface{}{"booleanValue": false},
	}
}
func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key].(map[string]interface{}); ok {
		if s, ok := v["stringValue"].(string); ok {
			return s
		}
	}
	return ""
}
func getInt(m map[string]interface{}, key string) int {
	if v, ok := m[key].(map[string]interface{}); ok {
		if s, ok := v["integerValue"].(string); ok {
			val, _ := strconv.Atoi(s)
			return val
		}
	}
	return 0
}
func getTime(m map[string]interface{}, key string) time.Time {
	if v, ok := m[key].(map[string]interface{}); ok {
		if s, ok := v["timestampValue"].(string); ok {
			t, _ := time.Parse(time.RFC3339Nano, s)
			return t
		}
	}
	return time.Time{}
}

func (s *FirestoreService) SaveArticle(article *models.Article) (string, error) {
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/articles", s.projectID)

	payload := map[string]interface{}{
		"fields": toFirestoreFields(article),
	}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	resp, err := http.Post(url, "application/json", bytes.NewReader(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		var bodyBytes, _ = io.ReadAll(resp.Body)
		return "", fmt.Errorf("firestore error: %s", string(bodyBytes))
	}

	var result struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	// Extract document ID from the returned name
	parts := strings.Split(result.Name, "/")
	docID := parts[len(parts)-1]
	return docID, nil
}

func (s *FirestoreService) GetArticles(limit int) ([]*models.Article, error) {
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/articles?pageSize=%d", s.projectID, limit)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("firestore error: %s", string(bodyBytes))
	}

	var result struct {
		Documents []struct {
			Name   string                 `json:"name"`
			Fields map[string]interface{} `json:"fields"`
		} `json:"documents"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	type sortableArticle struct {
		Article     *models.Article
		SubmittedAt time.Time
	}
	sortable := make([]sortableArticle, 0, len(result.Documents))
	for _, doc := range result.Documents {
		fields := doc.Fields
		parts := strings.Split(doc.Name, "/")
		docID := parts[len(parts)-1]
		submittedAt := getTime(fields, "submitted_at")
		article := &models.Article{
			ID:           docID,
			Title:        getString(fields, "title"),
			Content:      getString(fields, "content"),
			URL:          getString(fields, "url"),
			Source:       getString(fields, "source"),
			Author:       getString(fields, "author"),
			PublishedAt:  getTime(fields, "published_at"),
			ModelVersion: getString(fields, "model_version"),
			FIREScore: &models.FIREScore{
				OverallScore: getInt(fields, "fire_score"),
				Timestamp:    submittedAt,
			},
		}
		sortable = append(sortable, sortableArticle{Article: article, SubmittedAt: submittedAt})
	}
	// Sort by submitted_at descending (most recent first)
	sort.Slice(sortable, func(i, j int) bool {
		return sortable[i].SubmittedAt.After(sortable[j].SubmittedAt)
	})
	articles := make([]*models.Article, 0, len(sortable))
	for _, s := range sortable {
		articles = append(articles, s.Article)
	}
	return articles, nil
}

func (s *FirestoreService) GetArticleByID(id string) (*models.Article, error) {
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/articles/%s", s.projectID, id)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("firestore error: %s", string(bodyBytes))
	}

	var doc struct {
		Name   string                 `json:"name"`
		Fields map[string]interface{} `json:"fields"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&doc); err != nil {
		return nil, err
	}
	fields := doc.Fields

	article := &models.Article{
		ID:           id,
		Title:        getString(fields, "title"),
		Content:      getString(fields, "content"),
		URL:          getString(fields, "url"),
		Source:       getString(fields, "source"),
		Author:       getString(fields, "author"),
		PublishedAt:  getTime(fields, "published_at"),
		ModelVersion: getString(fields, "model_version"),
		FIREScore: &models.FIREScore{
			OverallScore: getInt(fields, "fire_score"),
			Timestamp:    getTime(fields, "submitted_at"),
		},
	}

	return article, nil
}

func (s *FirestoreService) ReportArticle(articleID string) error {
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/articles/%s?updateMask.fieldPaths=needs_moderation", s.projectID, articleID)

	payload := map[string]interface{}{
		"fields": map[string]interface{}{
			"needs_moderation": map[string]interface{}{"booleanValue": true},
		},
	}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPatch, url, bytes.NewReader(jsonData))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("firestore error: %s", string(bodyBytes))
	}

	log.Printf("Article %s marked for moderation", articleID)
	return nil
}

// SaveModeratorNote adds a note to the mod_notes subcollection for an article
func (s *FirestoreService) SaveModeratorNote(articleID string, note string, newLabel string) error {
	if note == "" {
		return nil
	}
	// Firestore REST API endpoint for subcollection
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/articles/%s/mod_notes", s.projectID, articleID)

	// Use timestamp as document ID (optional, Firestore will auto-generate if omitted)
	noteFieldName := fmt.Sprintf("note_%d", time.Now().UnixNano())
	payload := map[string]interface{}{
		"fields": map[string]interface{}{
			noteFieldName: map[string]interface{}{"stringValue": note},
		},
	}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	resp, err := http.Post(url, "application/json", bytes.NewReader(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("firestore error: %s", string(bodyBytes))
	}

	log.Printf("Saved moderator note for article %s: %s=%s", articleID, noteFieldName, note)
	return nil
}

// ApplyModeratorOverride updates an article with moderator's override
func (s *FirestoreService) ApplyModeratorOverride(articleID string, newFIREScore int) error {
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/articles/%s?updateMask.fieldPaths=fire_score&updateMask.fieldPaths=needs_moderation", s.projectID, articleID)

	payload := map[string]interface{}{
		"fields": map[string]interface{}{
			"fire_score":       map[string]interface{}{"integerValue": newFIREScore},
			"needs_moderation": map[string]interface{}{"booleanValue": false},
		},
	}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPatch, url, bytes.NewReader(jsonData))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("firestore error: %s", string(bodyBytes))
	}

	log.Printf("Applied moderator override to article %s: new_fire_score=%d", articleID, newFIREScore)
	return nil
}

// GetModeratorQueue retrieves articles that need moderation, sorted by fire_score ascending (lowest/worst first)
func (s *FirestoreService) GetModeratorQueue(limit int) ([]*models.Article, error) {
	// Fetch a reasonable number of articles (e.g., 100)
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/articles?pageSize=100", s.projectID)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("firestore error: %s", string(bodyBytes))
	}

	var result struct {
		Documents []struct {
			Name   string                 `json:"name"`
			Fields map[string]interface{} `json:"fields"`
		} `json:"documents"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	// Filter and sort in Go
	type sortableArticle struct {
		Article   *models.Article
		FireScore int
	}
	var queue []sortableArticle
	for _, doc := range result.Documents {
		fields := doc.Fields
		if needsMod, ok := fields["needs_moderation"].(map[string]interface{}); ok {
			if needs, ok := needsMod["booleanValue"].(bool); ok && needs {
				// Extract document ID from the name
				parts := strings.Split(doc.Name, "/")
				docID := parts[len(parts)-1]
				fireScore := getInt(fields, "fire_score")
				article := &models.Article{
					ID:           docID,
					Title:        getString(fields, "title"),
					Content:      getString(fields, "content"),
					URL:          getString(fields, "url"),
					Source:       getString(fields, "source"),
					Author:       getString(fields, "author"),
					PublishedAt:  getTime(fields, "published_at"),
					ModelVersion: getString(fields, "model_version"),
					FIREScore: &models.FIREScore{
						OverallScore: fireScore,
						Timestamp:    getTime(fields, "submitted_at"),
					},
				}
				queue = append(queue, sortableArticle{Article: article, FireScore: fireScore})
			}
		}
	}

	// Sort by fire_score ascending
	sort.Slice(queue, func(i, j int) bool {
		return queue[i].FireScore < queue[j].FireScore
	})

	// Limit results
	resultArticles := make([]*models.Article, 0, limit)
	for i := 0; i < len(queue) && i < limit; i++ {
		resultArticles = append(resultArticles, queue[i].Article)
	}

	log.Printf("Retrieved %d articles needing moderation", len(resultArticles))
	return resultArticles, nil
}
