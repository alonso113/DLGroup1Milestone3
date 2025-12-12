package models

import "time"

// Article represents a news article submission
type Article struct {
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	URL         string    `json:"url"`
	Source      string    `json:"source"`
	Author      string    `json:"author,omitempty"`
	PublishedAt time.Time `json:"published_at"`
	FIREScore   *FIREScore `json:"fire_score,omitempty"`
}

// FIREScore represents the fake news detection score
type FIREScore struct {
	OverallScore int       `json:"overall_score"` // 0-100
	Confidence   float64   `json:"confidence"`
	Timestamp    time.Time `json:"timestamp"`
}

// CreateArticleRequest matches the frontend's submission format
type CreateArticleRequest struct {
	Title       string `json:"title" binding:"required"`
	Content     string `json:"content" binding:"required"`
	URL         string `json:"url"`
	Source      string `json:"source" binding:"required"`
	Author      string `json:"author"`
	PublishedAt string `json:"publishedAt" binding:"required"`
}
