package models

import "time"

// Article represents a news article submission
type Article struct {
	ID           string     `json:"id,omitempty"`
	Title        string     `json:"title"`
	Content      string     `json:"content"`
	URL          string     `json:"url"`
	Source       string     `json:"source"`
	Author       string     `json:"author,omitempty"`
	PublishedAt  time.Time  `json:"published_at"`
	ModelVersion string     `json:"model_version,omitempty"`
	FIREScore    *FIREScore `json:"fire_score,omitempty"`
}

// FIREScore represents the fake news detection score
type FIREScore struct {
	OverallScore int       `json:"overall_score"` // 0-100
	Confidence   float64   `json:"confidence"`
	Timestamp    time.Time `json:"timestamp"`
}

type CreateArticleRequest struct {
	Title       string `json:"title" binding:"required"`
	Content     string `json:"content" binding:"required"`
	URL         string `json:"url"`
	Source      string `json:"source" binding:"required"`
	Author      string `json:"author"`
	PublishedAt string `json:"publishedAt" binding:"required"`
}
