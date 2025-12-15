package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	
	"backend/internal/models"
	"backend/internal/services"
)

// ArticleHandler handles article-related HTTP requests
type ArticleHandler struct {
	mlService        *services.MLService
	firestoreService *services.FirestoreService
}

// NewArticleHandler creates a new article handler
func NewArticleHandler(mlService *services.MLService, firestoreService *services.FirestoreService) *ArticleHandler {
	return &ArticleHandler{
		mlService:        mlService,
		firestoreService: firestoreService,
	}
}

// SubmitArticle handles POST /api/v1/partner/submit
func (h *ArticleHandler) SubmitArticle(w http.ResponseWriter, r *http.Request) {
	var req models.CreateArticleRequest
	
	// Parse JSON from React frontend
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Failed to decode request: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	
	// Validate required fields
	if req.Title == "" || req.Content == "" || req.Source == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}
	
	// Parse published date
	publishedAt, err := time.Parse(time.RFC3339, req.PublishedAt)
	if err != nil {
		// Try alternative date format
		publishedAt, err = time.Parse("2006-01-02", req.PublishedAt)
		if err != nil {
			log.Printf("Failed to parse date: %v", err)
			http.Error(w, "Invalid date format", http.StatusBadRequest)
			return
		}
	}
	
	// Create article object
	article := models.Article{
		Title:       req.Title,
		Content:     req.Content,
		URL:         req.URL,
		Source:      req.Source,
		Author:      req.Author,
		PublishedAt: publishedAt,
	}
	
	// Call ML service to get FIRE score
	log.Printf("Predicting FIRE score for article: %s", article.Title)
	fireScore, err := h.mlService.PredictFIREScore(article.Content)
	if err != nil {
		log.Printf("ML prediction failed: %v", err)
		http.Error(w, "Failed to calculate FIRE score", http.StatusInternalServerError)
		return
	}
	
	article.FIREScore = fireScore
	log.Printf("FIRE score calculated: %d", fireScore.OverallScore)
	
	// Save article to Firestore
	articleID, err := h.firestoreService.SaveArticle(&article)
	if err != nil {
		log.Printf("Failed to save article to Firestore: %v", err)
		http.Error(w, "Failed to save article", http.StatusInternalServerError)
		return
	}
	
	log.Printf("Article saved to Firestore with ID: %s", articleID)
	
	// Create response matching frontend expectations
	response := map[string]interface{}{
		"article_id": articleID,
		"fire_score": map[string]interface{}{
			"score":      fireScore.OverallScore,
			"confidence": fireScore.Confidence,
			"label":      getLabelFromScore(fireScore.OverallScore),
			"category":   getCategoryFromScore(fireScore.OverallScore),
		},
	}
	
	// Return result to frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}

// Helper function to get label from score
// Higher score = more reliable (real), Lower score = less reliable (fake)
func getLabelFromScore(score int) string {
	if score >= 50 {
		return "real"
	}
	return "fake"
}

// Helper function to get category from score
// Higher score = safer, Lower score = riskier
func getCategoryFromScore(score int) string {
	if score >= 50 {
		return "No risk detected"
	} else if score >= 35 {
		return "Unverified"
	}
	return "Likely misleading"
}

func getConfidenceFromScore(score int) float64 {
    if score >= 50 {
        // True news: score = 50 + (confidence * 50)
        return float64(score-50) / 50.0
    }
    // Fake news: score = 50 - (confidence * 50)
    return float64(50-score) / 50.0
}

// GetArticles handles GET /api/v1/articles
func (h *ArticleHandler) GetArticles(w http.ResponseWriter, r *http.Request) {
	// Retrieve articles from Firestore (limit to 50)
	articles, err := h.firestoreService.GetArticles(50)
	if err != nil {
		log.Printf("Failed to retrieve articles from Firestore: %v", err)
		http.Error(w, "Failed to retrieve articles", http.StatusInternalServerError)
		return
	}
	
	log.Printf("Retrieved %d articles from Firestore", len(articles))
	
	// Transform articles to include calculated fields (label, category, confidence)
	response := make([]map[string]interface{}, 0, len(articles))
	for i, article := range articles {
		log.Printf("📰 Article %d: ID=%s, Title=%s, Source=%s", i+1, article.ID, article.Title, article.Source)
		log.Printf("   PublishedAt=%v, HasFIREScore=%v", article.PublishedAt, article.FIREScore != nil)
		
		articleMap := map[string]interface{}{
			"id":          article.ID,
			"title":       article.Title,
			"content":     article.Content,
			"url":         article.URL,
			"source":      article.Source,
			"author":      article.Author,
			"publishedAt": article.PublishedAt,
		}
		
		if article.FIREScore != nil {
			log.Printf("   FIRE Score=%d, Confidence will be %.2f", article.FIREScore.OverallScore, getConfidenceFromScore(article.FIREScore.OverallScore))
			articleMap["fire_score"] = map[string]interface{}{
				"score":      article.FIREScore.OverallScore,
				"confidence": getConfidenceFromScore(article.FIREScore.OverallScore),
				"label":      getLabelFromScore(article.FIREScore.OverallScore),
				"category":   getCategoryFromScore(article.FIREScore.OverallScore),
			}
		}
		
		response = append(response, articleMap)
	}
	
	log.Printf("✅ Sending response with %d articles", len(response))
	
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("❌ Failed to encode response: %v", err)
	} else {
		log.Printf("✅ Response sent successfully")
	}
}

// ReportArticle handles POST /api/v1/articles/{id}/report
func (h *ArticleHandler) ReportArticle(w http.ResponseWriter, r *http.Request) {
	// Get article ID from URL
	vars := mux.Vars(r)
	articleID := vars["id"]
	
	if articleID == "" {
		http.Error(w, "Article ID is required", http.StatusBadRequest)
		return
	}
	
	// Parse request body (optional reason field)
	var reqBody struct {
		Reason string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		// Ignore parse errors - reason is optional
	}
	
	log.Printf("📢 Reporting article %s for moderation. Reason: %s", articleID, reqBody.Reason)
	
	// Mark article as needing moderation in Firestore
	if err := h.firestoreService.ReportArticle(articleID); err != nil {
		log.Printf("Failed to report article: %v", err)
		http.Error(w, "Failed to report article", http.StatusInternalServerError)
		return
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Article reported successfully",
	})
}

// GetModeratorQueue handles GET /api/v1/moderator/queue
func (h *ArticleHandler) GetModeratorQueue(w http.ResponseWriter, r *http.Request) {
	// Retrieve articles needing moderation (limit to 50)
	articles, err := h.firestoreService.GetModeratorQueue(50)
	if err != nil {
		log.Printf("Failed to retrieve moderator queue: %v", err)
		http.Error(w, "Failed to retrieve moderator queue", http.StatusInternalServerError)
		return
	}
	
	log.Printf("Retrieved %d articles in moderation queue", len(articles))
	
	// Transform articles to include calculated fields
	response := make([]map[string]interface{}, 0, len(articles))
	for _, article := range articles {
		articleMap := map[string]interface{}{
			"id":          article.ID,
			"title":       article.Title,
			"content":     article.Content,
			"url":         article.URL,
			"source":      article.Source,
			"author":      article.Author,
			"publishedAt": article.PublishedAt,
		}
		
		if article.FIREScore != nil {
			articleMap["fire_score"] = map[string]interface{}{
				"score":      article.FIREScore.OverallScore,
				"confidence": getConfidenceFromScore(article.FIREScore.OverallScore),
				"label":      getLabelFromScore(article.FIREScore.OverallScore),
				"category":   getCategoryFromScore(article.FIREScore.OverallScore),
			}
		}
		
		response = append(response, articleMap)
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetArticleByID handles GET /api/v1/articles/{id}
func (h *ArticleHandler) GetArticleByID(w http.ResponseWriter, r *http.Request) {
	// Get article ID from URL
	vars := mux.Vars(r)
	articleID := vars["id"]
	
	if articleID == "" {
		http.Error(w, "Article ID is required", http.StatusBadRequest)
		return
	}
	
	log.Printf("Fetching article with ID: %s", articleID)
	
	// Retrieve article from Firestore
	article, err := h.firestoreService.GetArticleByID(articleID)
	if err != nil {
		log.Printf("Failed to retrieve article: %v", err)
		http.Error(w, "Article not found", http.StatusNotFound)
		return
	}
	
	// Transform article to include calculated fields
	response := map[string]interface{}{
		"id":          article.ID,
		"title":       article.Title,
		"content":     article.Content,
		"url":         article.URL,
		"source":      article.Source,
		"author":      article.Author,
		"publishedAt": article.PublishedAt,
	}
	
	if article.FIREScore != nil {
		response["fire_score"] = map[string]interface{}{
			"score":      article.FIREScore.OverallScore,
			"confidence": getConfidenceFromScore(article.FIREScore.OverallScore),
			"label":      getLabelFromScore(article.FIREScore.OverallScore),
			"category":   getCategoryFromScore(article.FIREScore.OverallScore),
		}
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
