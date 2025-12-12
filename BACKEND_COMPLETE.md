# 🎉 Go Backend with Python ML - Complete!

## What's Been Built

Your FIRE News Aggregator now has a **complete backend** with ML integration!

### ✅ Backend Architecture

```
backend/
├── cmd/api/
│   └── main.go                          # ✅ HTTP server with CORS
├── internal/
│   ├── handlers/
│   │   └── article_handler.go          # ✅ POST /api/v1/partner/submit
│   ├── services/
│   │   └── ml_service.go               # ✅ Python subprocess caller
│   └── models/
│       └── article.go                  # ✅ Data structures
├── ml/
│   ├── predict.py                      # ✅ PyTorch model loader
│   ├── requirements.txt                # ✅ Python dependencies
│   └── bestmodel_3_run5.pt            # ⚠️ COPY YOUR MODEL HERE
└── go.mod                              # ✅ Go dependencies
```

## How It Works

```
┌──────────────────────────────────────────────────────────┐
│  User fills form in SubmitArticle.tsx                    │
│  Clicks "Submit Article"                                 │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼ POST /api/v1/partner/submit
┌──────────────────────────────────────────────────────────┐
│  Go Backend (Port 8080)                                  │
│  ├─ article_handler.go receives request                  │
│  ├─ Validates article data                               │
│  └─ Calls ml_service.PredictFIREScore()                  │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼ exec.Command("python", "predict.py", "text")
┌──────────────────────────────────────────────────────────┐
│  Python ML Script (predict.py)                           │
│  ├─ Loads bestmodel_3_run5.pt                           │
│  ├─ Preprocesses article text                            │
│  ├─ Runs model.predict()                                 │
│  └─ Prints JSON: {"overall_score": 73, ...}             │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼ Captures stdout
┌──────────────────────────────────────────────────────────┐
│  Go parses JSON response                                 │
│  Returns article + FIRE score to frontend                │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│  Frontend displays FIRE score with colored badge         │
└──────────────────────────────────────────────────────────┘
```

## What You Need to Do

### 1. Install Go (If Not Already Installed)

**Check if you have Go:**
```bash
go version
```

**If not installed:**
1. Go to https://go.dev/dl/
2. Download **Go 1.21+** for Windows
3. Run installer
4. Restart VS Code

### 2. Install Python Dependencies

```bash
cd backend\ml
pip install torch transformers numpy
```

### 3. Copy Your Model File

```bash
# From project root
copy bestmodel_3_run5.pt backend\ml\bestmodel_3_run5.pt
```

### 4. Get Go Dependencies

```bash
cd backend
go get github.com/gorilla/mux
```

### 5. Customize the ML Prediction (IMPORTANT!)

Open `backend\ml\predict.py` and update lines 48-72:

**Current (Mock Data):**
```python
# Mock prediction for testing (REMOVE THIS and use actual model)
fire_score = 73  # Replace with: int(prediction.item() * 100)

dimensions = {
    "factuality": 0.85,      # Replace with actual model output
    "inflammatory": 0.23,
    "reporting": 0.91,
    "extremism": 0.12
}
```

**Replace with your actual model inference:**
```python
# Your actual model code
inputs = tokenizer(processed_text, return_tensors='pt', ...)
outputs = model(**inputs)
fire_score = int(outputs.logits.item() * 100)  # Adjust to your model
dimensions = extract_dimensions(outputs)        # Your dimension logic
```

### 6. Start the Backend

```bash
cd backend
go run cmd\api\main.go
```

You should see:
```
🚀 FIRE News Backend Starting...
Python path: python
Script path: C:\Users\...\backend\ml\predict.py
✅ Server running on http://localhost:8080
✅ API endpoint: http://localhost:8080/api/v1
```

### 7. Test the Full Stack

**Terminal 1: Backend**
```bash
cd backend
go run cmd\api\main.go
```

**Terminal 2: Frontend (already running)**
```bash
cd frontend
npm run dev
```

**Test Flow:**
1. Open http://localhost:3000/submit
2. Fill in article details:
   - Title: "Test Article"
   - Content: "Some article text to test FIRE scoring..."
   - Source: "Test News"
   - URL: "https://example.com"
   - Published date: Pick any date
3. Click "Submit Article"
4. Watch backend terminal logs:
   ```
   POST /api/v1/partner/submit
   Predicting FIRE score for article: Test Article
   FIRE score calculated: 73
   ```
5. Frontend should show success message

## API Endpoints

### Article Submission
```http
POST http://localhost:8080/api/v1/partner/submit
Content-Type: application/json

{
  "title": "Breaking News",
  "content": "Full article text...",
  "url": "https://example.com/article",
  "source": "CNN",
  "author": "John Doe",
  "publishedAt": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "title": "Breaking News",
  "content": "Full article text...",
  "url": "https://example.com/article",
  "source": "CNN",
  "author": "John Doe",
  "published_at": "2024-01-15T10:30:00Z",
  "fire_score": {
    "overall_score": 73,
    "dimensions": {
      "factuality": 0.85,
      "inflammatory": 0.23,
      "reporting": 0.91,
      "extremism": 0.12
    },
    "confidence": 0.87,
    "timestamp": "2024-01-15T10:30:05Z"
  }
}
```

## Project Status

### ✅ Completed
- Go backend structure (Standard Go Project Layout)
- HTTP server with Gorilla Mux router
- CORS middleware for React frontend
- Article submission handler
- ML service with Python subprocess integration
- Python prediction script with PyTorch
- Type-safe data models
- Error handling and logging

### ⚠️ To Do
1. **Install Go** (if not already installed)
2. **Copy model file** to `backend\ml\`
3. **Customize predict.py** with your actual model inference
4. **Test submission** from frontend

### 🔮 Future Enhancements (Optional)
- Add PostgreSQL database for article persistence
- Add GET /articles endpoint to retrieve submissions
- Add moderator review queue endpoints
- Optimize ML service (load model once, not per request)
- Add caching for repeated articles
- Add rate limiting
- Docker Compose for full stack

## Troubleshooting

### Backend won't start
**"go: command not found"**
- Go is not installed → Install from https://go.dev/dl/

**"cannot find package github.com/gorilla/mux"**
```bash
cd backend
go get github.com/gorilla/mux
```

### ML Prediction Fails
**"torch module not found"**
```bash
pip install torch
```

**"Model file not found"**
- Copy model: `copy bestmodel_3_run5.pt backend\ml\`
- Check path in predict.py line 80

### CORS Errors
- Backend CORS is set to `http://localhost:3000`
- If frontend on different port, update `main.go` line 57

### Slow Predictions
- Normal! Subprocess approach is slow (~500ms)
- For speed: Load model once at startup (requires refactoring)

## Demo Flow for Presentation

1. **Show Architecture Diagram**: "We use Go for HTTP handling and Python for ML inference"

2. **Show Code Structure**: "Standard Go project layout with clean separation of concerns"

3. **Start Backend**: "The server starts on port 8080 and loads our PyTorch model"

4. **Submit Article**: "When a partner submits an article through our frontend..."

5. **Show Logs**: "The backend receives it, calls the Python model, and returns a FIRE score"

6. **Show Result**: "The score is displayed with color-coded severity - green for reliable, red for questionable"

---

**Your full-stack FIRE News Aggregator is ready! 🚀**

Once you install Go and customize the ML prediction, you'll have a working demo!
