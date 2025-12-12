# Backend Setup Guide

## Prerequisites Check

Before proceeding, you need:
- ✅ **Go 1.21+** installed
- ✅ **Python 3.8+** installed (you already have this)
- ✅ **PyTorch** installed

## Step 1: Install Go

### Download & Install Go
1. Go to https://go.dev/dl/
2. Download **Go 1.21+** for Windows
3. Run the installer
4. Restart VS Code terminal

### Verify Installation
```bash
go version
```
Should show: `go version go1.21.x windows/amd64`

## Step 2: Install Python Dependencies

```bash
cd backend\ml
pip install torch transformers numpy
```

## Step 3: Run the Backend

```bash
cd backend
go run main.go
```

You should see:
```
🚀 FIRE News Backend Starting...
Python path: python
Script path: C:\Users\...\backend\ml\predict.py
✅ Server running on http://localhost:8080
✅ API endpoint: http://localhost:8080/api/v1
```

## Step 4: Test with Frontend

1. Keep backend running
2. In another terminal, start frontend:
   ```bash
   cd frontend
   npm run dev
   ```
3. Go to http://localhost:3000/submit
4. Submit a test article
5. Check backend terminal for logs

## Troubleshooting

### "go: command not found"
- Go is not installed or not in PATH
- Install Go from https://go.dev/dl/
- Restart terminal after installation

### "python: command not found"
- Set Python path explicitly in backend startup
- Or set environment variable: `set PYTHON_PATH=C:\Python311\python.exe`

### "torch module not found"
```bash
pip install torch
```

### "Model file not found"
- Make sure `bestmodel_3_run5.pt` is in `backend\ml\` directory
- Update path in `predict.py` if model is elsewhere

## Next Steps After Setup

### 1. Customize the ML Prediction

Open `backend\ml\predict.py` and update the `predict_fire_score()` function with your actual model inference code. Currently it returns mock data.

### 2. Test Full Flow

1. Submit article from frontend
2. Backend logs should show:
   ```
   POST /api/v1/partner/submit
   Predicting FIRE score for article: [title]
   FIRE score calculated: 73
   ```
3. Frontend should display the article with FIRE score

### 3. Add Database (Later)

Once submissions work, add PostgreSQL to persist articles:
- Install PostgreSQL
- Create database schema
- Update handlers to save/retrieve from DB

---

## Quick Start (After Go Installation)

```bash
# Terminal 1: Backend
cd backend
go mod init backend
go get github.com/gorilla/mux
copy ..\bestmodel_3_run5.pt ml\bestmodel_3_run5.pt
go run cmd\api\main.go

# Terminal 2: Frontend (already running)
# Should already be at http://localhost:3000
```

**Your backend will be ready at http://localhost:8080** 🚀
