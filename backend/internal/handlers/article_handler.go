package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"backend/internal/models"
	"backend/internal/services"
)

// ArticleHandler handles article-related HTTP requests
type ArticleHandler struct {
	mlService *services.MLService
}

// NewArticleHandler creates a new article handler
func NewArticleHandler(mlService *services.MLService) *ArticleHandler {
	return &ArticleHandler{
		mlService: mlService,
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
	
	// Create response matching frontend expectations
	response := map[string]interface{}{
		"article_id": "generated-id-" + article.Title[:10], // TODO: Use actual database ID
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

// GetArticles handles GET /api/v1/articles (placeholder for now)
func (h *ArticleHandler) GetArticles(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement database retrieval
	// For now, return empty array
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]models.Article{})
}
