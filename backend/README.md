# FIRE News Backend

Go backend with Python ML integration for FIRE News Aggregator.

## Architecture

```
backend/
├── cmd/api/main.go              # HTTP server entry point
├── internal/
│   ├── handlers/                # HTTP request handlers
│   ├── services/                # Business logic (ML service)
│   └── models/                  # Data structures
└── ml/
    ├── predict.py               # Python ML inference script
    ├── requirements.txt         # Python dependencies
    └── bestmodel_3_run5.pt     # Trained PyTorch model (copy here)
```

## Setup

### 1. Install Go Dependencies

```bash
cd backend
go mod init backend
go get github.com/gorilla/mux
```

### 2. Install Python Dependencies

```bash
cd ml
pip install -r requirements.txt
```

### 3. Copy Your Model

```bash
# Copy your trained model to the ml/ directory
cp ../bestmodel_3_run5.pt ml/
```

### 4. Configure Python Path (if needed)

```bash
# Windows
set PYTHON_PATH=python

# Linux/Mac
export PYTHON_PATH=python3
```

## Running the Backend

```bash
cd backend
go run cmd/api/main.go
```

Server will start on **http://localhost:8080**

## API Endpoints

### Submit Article (Connected to Frontend)
```
POST /api/v1/partner/submit
```

**Request Body:**
```json
{
  "title": "Article Title",
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
  "title": "Article Title",
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

## How It Works

1. **Frontend submits article** via `SubmitArticle.tsx`
2. **Go handler** receives POST request
3. **Go calls Python subprocess**: `python ml/predict.py "article text"`
4. **Python loads model** (`bestmodel_3_run5.pt`)
5. **Python runs inference** and prints JSON to stdout
6. **Go captures JSON output** and parses it
7. **Go returns result** to frontend

## Next Steps

### ⚠️ Important: Customize predict.py

The `ml/predict.py` file currently contains **mock predictions**. You need to:

1. Open `ml/predict.py`
2. Update the `predict_fire_score()` function with your actual model inference code
3. Adjust preprocessing to match how you trained your model
4. Update the output format if your model has different dimensions

### Testing

1. Start backend: `go run cmd/api/main.go`
2. Start frontend: `cd ../frontend && npm run dev`
3. Go to http://localhost:3000/submit
4. Submit a test article
5. Check backend logs to see FIRE score calculation

## Troubleshooting

**Python not found:**
```bash
# Set Python path explicitly
set PYTHON_PATH=C:\Python311\python.exe  # Windows
export PYTHON_PATH=/usr/bin/python3      # Linux/Mac
```

**Model not found:**
- Make sure `bestmodel_3_run5.pt` is in `backend/ml/` directory
- Check the path in `predict.py` line 80

**CORS errors:**
- Backend is configured for `http://localhost:3000`
- If frontend runs on different port, update CORS in `main.go`

## Performance Note

Current implementation uses subprocess calls (slow). For production:
- Load model once at startup
- Use gRPC or HTTP service for Python
- Keep model in memory
