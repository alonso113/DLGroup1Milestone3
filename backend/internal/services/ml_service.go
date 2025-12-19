package services

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"time"

	"backend/internal/models"
)

// MLService handles machine learning predictions
type MLService struct {
	pythonPath string
	scriptPath string
}

// MLPredictionResponse represents the JSON output from Python
type MLPredictionResponse struct {
	OverallScore int     `json:"overall_score"`
	Confidence   float64 `json:"confidence"`
}

func NewMLService(pythonPath, scriptPath string) *MLService {
	return &MLService{
		pythonPath: pythonPath,
		scriptPath: scriptPath,
	}
}

// PredictFIREScore calls the Python ML model and returns a FIRE score
func (s *MLService) PredictFIREScore(articleText string) (*models.FIREScore, error) {
	// Execute Python script with article text as argument
	cmd := exec.Command(s.pythonPath, s.scriptPath, articleText)

	// Capture stdout and stderr
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("python execution failed: %w, output: %s", err, string(output))
	}

	// Parse JSON response from Python
	var response MLPredictionResponse
	if err := json.Unmarshal(output, &response); err != nil {
		return nil, fmt.Errorf("failed to parse ML response: %w, output: %s", err, string(output))
	}

	// Create FIREScore model
	fireScore := &models.FIREScore{
		OverallScore: response.OverallScore,
		Confidence:   response.Confidence,
		Timestamp:    time.Now(),
	}

	return fireScore, nil
}
