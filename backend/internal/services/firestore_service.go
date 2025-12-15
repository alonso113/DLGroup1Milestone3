package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"

	"backend/internal/models"
)

// Current model version for tracking predictions
const ModelVersion = "v1.0.0"

// FirestoreService handles database operations
type FirestoreService struct {
	client *firestore.Client
	ctx    context.Context
}

// NewFirestoreService creates a new Firestore service
func NewFirestoreService(credentialsPath string) (*FirestoreService, error) {
	ctx := context.Background()

	// Initialize Firebase app with service account
	opt := option.WithCredentialsFile(credentialsPath)
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return nil, err
	}

	// Get Firestore client
	client, err := app.Firestore(ctx)
	if err != nil {
		return nil, err
	}

	log.Println("✅ Connected to Firestore")

	return &FirestoreService{
		client: client,
		ctx:    ctx,
	}, nil
}

// Close closes the Firestore connection
func (s *FirestoreService) Close() error {
	return s.client.Close()
}

// SaveArticle saves an article to Firestore
func (s *FirestoreService) SaveArticle(article *models.Article) (string, error) {
	// Create document in articles collection
	docRef, _, err := s.client.Collection("articles").Add(s.ctx, map[string]interface{}{
		"title":            article.Title,
		"content":          article.Content,
		"url":              article.URL,
		"source":           article.Source,
		"author":           article.Author,
		"published_at":     article.PublishedAt,
		"submitted_at":     time.Now(),
		"fire_score":       article.FIREScore.OverallScore,
		"model_version":    ModelVersion,
		"needs_moderation": false, // Initialize as false for new articles
	})

	if err != nil {
		return "", err
	}

	log.Printf("Article saved to Firestore with ID: %s", docRef.ID)
	return docRef.ID, nil
}

// GetArticles retrieves articles from Firestore
func (s *FirestoreService) GetArticles(limit int) ([]*models.Article, error) {
	query := s.client.Collection("articles").
		OrderBy("submitted_at", firestore.Desc).
		Limit(limit)

	docs, err := query.Documents(s.ctx).GetAll()
	if err != nil {
		return nil, err
	}

	articles := make([]*models.Article, 0, len(docs))
	for _, doc := range docs {
		data := doc.Data()

		// Parse timestamps
		publishedAt, _ := data["published_at"].(time.Time)
		submittedAt, _ := data["submitted_at"].(time.Time)
		
		// Get fire_score as int or float64
		var fireScore int
		switch v := data["fire_score"].(type) {
		case int64:
			fireScore = int(v)
		case float64:
			fireScore = int(v)
		default:
			fireScore = 0
		}

		article := &models.Article{
			ID:           doc.Ref.ID,
			Title:        getStringField(data, "title"),
			Content:      getStringField(data, "content"),
			URL:          getStringField(data, "url"),
			Source:       getStringField(data, "source"),
			Author:       getStringField(data, "author"),
			PublishedAt:  publishedAt,
			ModelVersion: getStringField(data, "model_version"),
			FIREScore: &models.FIREScore{
				OverallScore: fireScore,
				Timestamp:    submittedAt,
			},
		}

		articles = append(articles, article)
	}

	return articles, nil
}

// GetArticleByID retrieves a single article by ID
func (s *FirestoreService) GetArticleByID(id string) (*models.Article, error) {
	doc, err := s.client.Collection("articles").Doc(id).Get(s.ctx)
	if err != nil {
		return nil, err
	}

	data := doc.Data()
	publishedAt, _ := data["published_at"].(time.Time)
	submittedAt, _ := data["submitted_at"].(time.Time)

	var fireScore int
	switch v := data["fire_score"].(type) {
	case int64:
		fireScore = int(v)
	case float64:
		fireScore = int(v)
	default:
		fireScore = 0
	}

	article := &models.Article{
		ID:           id,
		Title:        getStringField(data, "title"),
		Content:      getStringField(data, "content"),
		URL:          getStringField(data, "url"),
		Source:       getStringField(data, "source"),
		Author:       getStringField(data, "author"),
		PublishedAt:  publishedAt,
		ModelVersion: getStringField(data, "model_version"),
		FIREScore: &models.FIREScore{
			OverallScore: fireScore,
			Timestamp:    submittedAt,
		},
	}

	return article, nil
}

// ReportArticle marks an article as needing moderation
func (s *FirestoreService) ReportArticle(articleID string) error {
	_, err := s.client.Collection("articles").Doc(articleID).Update(s.ctx, []firestore.Update{
		{Path: "needs_moderation", Value: true},
	})
	
	if err != nil {
		return err
	}
	
	log.Printf("Article %s marked for moderation", articleID)
	return nil
}

// SaveModeratorNote adds a note to the mod_notes subcollection for an article
func (s *FirestoreService) SaveModeratorNote(articleID string, note string, newLabel string) error {
	if note == "" {
		// No note to save
		return nil
	}
	
	// Get reference to mod_notes subcollection
	modNotesRef := s.client.Collection("articles").Doc(articleID).Collection("mod_notes")
	
	// Get all existing notes to determine the next note number
	docs, err := modNotesRef.Documents(s.ctx).GetAll()
	if err != nil {
		return err
	}
	
	// Determine next note number (note_1, note_2, etc.)
	noteCount := len(docs) + 1
	noteFieldName := fmt.Sprintf("note_%d", noteCount)
	
	// Create a document with timestamp as ID (or use a fixed doc ID if you want all notes in one doc)
	noteDoc := map[string]interface{}{
		noteFieldName: note,
	}
	
	// Add the note document
	_, _, err = modNotesRef.Add(s.ctx, noteDoc)
	if err != nil {
		return err
	}
	
	log.Printf("Saved moderator note for article %s: %s=%s", articleID, noteFieldName, note)
	return nil
}

// ApplyModeratorOverride updates an article with moderator's override
func (s *FirestoreService) ApplyModeratorOverride(articleID string, newFIREScore int) error {
	// Update the article with new FIRE score and clear moderation flag
	_, err := s.client.Collection("articles").Doc(articleID).Update(s.ctx, []firestore.Update{
		{Path: "fire_score", Value: newFIREScore},
		{Path: "needs_moderation", Value: false},
	})
	
	if err != nil {
		return err
	}
	
	log.Printf("Applied moderator override to article %s: new_fire_score=%d", articleID, newFIREScore)
	return nil
}

// GetModeratorQueue retrieves articles that need moderation, sorted by fire_score ascending (lowest/worst first)
func (s *FirestoreService) GetModeratorQueue(limit int) ([]*models.Article, error) {
	query := s.client.Collection("articles").
		Where("needs_moderation", "==", true).
		OrderBy("fire_score", firestore.Asc).
		Limit(limit)

	docs, err := query.Documents(s.ctx).GetAll()
	if err != nil {
		return nil, err
	}

	articles := make([]*models.Article, 0, len(docs))
	for _, doc := range docs {
		data := doc.Data()

		// Parse timestamps
		publishedAt, _ := data["published_at"].(time.Time)
		submittedAt, _ := data["submitted_at"].(time.Time)
		
		// Get fire_score as int or float64
		var fireScore int
		switch v := data["fire_score"].(type) {
		case int64:
			fireScore = int(v)
		case float64:
			fireScore = int(v)
		default:
			fireScore = 0
		}

		article := &models.Article{
			ID:          doc.Ref.ID,
			Title:       getStringField(data, "title"),
			Content:     getStringField(data, "content"),
			URL:         getStringField(data, "url"),
			Source:      getStringField(data, "source"),
			Author:      getStringField(data, "author"),
			PublishedAt: publishedAt,
			FIREScore: &models.FIREScore{
				OverallScore: fireScore,
				Timestamp:    submittedAt,
			},
		}

		articles = append(articles, article)
	}

	log.Printf("Retrieved %d articles needing moderation", len(articles))
	return articles, nil
}

// Helper function to safely get string field
func getStringField(data map[string]interface{}, key string) string {
	if val, ok := data[key].(string); ok {
		return val
	}
	return ""
}
