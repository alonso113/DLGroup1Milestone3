package main

import (
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/gorilla/mux"

	"backend/internal/handlers"
	"backend/internal/services"
)

func main() {
	log.Println("🚀 FIRE News Backend Starting...")

	// Get paths
	pythonPath := getPythonPath()
	scriptPath := getScriptPath()

	log.Printf("Python path: %s", pythonPath)
	log.Printf("Script path: %s", scriptPath)

	// Initialize ML service
	mlService := services.NewMLService(pythonPath, scriptPath)

	// Initialize Firestore service (no credentials needed with public rules)
	firestoreService, err := services.NewFirestoreService()
	if err != nil {
		log.Fatalf("Failed to initialize Firestore: %v", err)
	}

	// Initialize handlers
	articleHandler := handlers.NewArticleHandler(mlService, firestoreService)

	// Setup router
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/partner/submit", articleHandler.SubmitArticle).Methods("POST", "OPTIONS")
	api.HandleFunc("/articles/{id}/report", articleHandler.ReportArticle).Methods("POST", "OPTIONS")
	api.HandleFunc("/articles/{id}", articleHandler.GetArticleByID).Methods("GET", "OPTIONS")
	api.HandleFunc("/articles", articleHandler.GetArticles).Methods("GET", "OPTIONS")
	api.HandleFunc("/moderator/queue", articleHandler.GetModeratorQueue).Methods("GET", "OPTIONS")
	api.HandleFunc("/moderator/override", articleHandler.OverrideFIREScore).Methods("POST", "OPTIONS")

	// Apply CORS middleware
	r.Use(corsMiddleware)
	r.Use(loggingMiddleware)

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Start server
	port := "8080"
	log.Printf("✅ Server running on http://localhost:%s", port)
	log.Printf("✅ API endpoint: http://localhost:%s/api/v1", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// corsMiddleware adds CORS headers for React frontend
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "3600")

		// Handle preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// loggingMiddleware logs all requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

// getPythonPath returns the Python executable path
func getPythonPath() string {
	if path := os.Getenv("PYTHON_PATH"); path != "" {
		return path
	}

	// Try common Python executables in order of preference
	// python3 is standard on Mac/Linux, python on Windows
	candidates := []string{"python3", "python"}

	for _, candidate := range candidates {
		// Check if executable exists in PATH
		if _, err := exec.LookPath(candidate); err == nil {
			return candidate
		}
	}

	// Default to python3 if none found
	return "python3"
}

// getScriptPath returns the absolute path to predict.py
func getScriptPath() string {
	// Get current working directory
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	// Path to ml/predict.py relative to project root
	return filepath.Join(wd, "ml", "predict.py")
}
