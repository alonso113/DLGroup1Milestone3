# FIRE News Aggregator

> **F**ake **I**nformation **R**isk **E**valuation - A Deep Learning-powered news verification platform

A full-stack application that uses a fine-tuned DistilBERT model to assess news article credibility and provide risk scores (0-100) to help readers navigate today's information landscape.

## 🚀 Quick Start

### Prerequisites
- **Git LFS** (for 250MB model file) - [Install](https://git-lfs.github.com/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Go 1.21+** - [Download](https://go.dev/dl/)
- **Python 3.8+** with pip

### Installation

```bash
# 1. Clone repository (requires Git LFS installed first!)
git lfs install
git clone https://github.com/alonso113/DLGroup1Milestone3.git
cd DLGroup1Milestone3

# Verify model downloaded (should be ~250MB, not 130 bytes)
ls -lh backend/ml/bestmodel_3_run5.pt

# 2. Start Backend (new terminal)
cd backend
go mod tidy
cd ml && pip install -r requirements.txt && cd ..
go run main.go

# 3. Start Frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## ✨ Features

- 📰 **News Feed** - Browse articles with real-time FIRE scores
- 🎯 **ML Risk Assessment** - DistilBERT-powered scoring (0-100)
  - 🟢 50-100: Real news (low risk)
  - 🟡 35-49: Unverified
  - 🔴 0-34: Likely misleading (high risk)
- 🚩 **User Reporting** - Flag incorrect scores for review
- 👮 **Moderator Console** - Review queue with override capabilities
- 📝 **Moderator Notes** - Track override decisions for model retraining
- 🔐 **Firebase Authentication** - Secure moderator-only access
- 📊 **Model & Data Cards** - Full transparency documentation

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   Go API     │─────▶│  Python ML  │
│  Frontend   │      │   Backend    │      │  (PyTorch)  │
│  Port 3000  │◀─────│   Port 8080  │◀─────│  DistilBERT │
└─────────────┘      └──────┬───────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Firestore  │
                     │  Database   │
                     └─────────────┘
```

### Tech Stack

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Firebase Auth  
**Backend**: Go 1.21 + Gorilla Mux + Firebase Admin SDK  
**ML**: Python + PyTorch + Transformers (DistilBERT)  
**Database**: Firebase Firestore  
**Model**: 250MB trained model (Git LFS tracked)

## 📁 Project Structure

```
DLGroup1Milestone3/
├── frontend/
│   └── src/
│       ├── pages/          # Dashboard, ArticlePage, ModeratorConsole
│       ├── components/     # FIREBadge, ArticleCard, Header
│       ├── services/       # API integration layer
│       └── types/          # TypeScript definitions
│
├── backend/
│   ├── main.go            # Server entry point
│   ├── internal/
│   │   ├── handlers/      # HTTP endpoints
│   │   ├── services/      # Business logic + ML service
│   │   └── models/        # Data structures
│   └── ml/
│       ├── predict.py     # ML inference script
│       └── bestmodel_3_run5.pt  # Trained model (250MB)
│
└── firebase-credentials.json  # Firebase service account
```

## 🔧 Setup Details

### Git LFS Setup
**Required for downloading the 250MB model file!**

```bash
# Install Git LFS first
# Windows: https://git-lfs.github.com/
# Mac: brew install git-lfs
# Linux: sudo apt-get install git-lfs

git lfs install
git lfs pull

# Verify model size
ls -lh backend/ml/bestmodel_3_run5.pt
# Should show ~250MB, not 130 bytes!
```

## 🎮 Usage

### Public User Flow
1. Visit http://localhost:3000
2. Browse news feed with FIRE scores
3. Click article to read full content
4. Report incorrect scores

### Moderator Flow
1. Navigate to `/mod` → Redirected to login
2. Login: `moderator@fire-news.com` / `moderator123`
3. View moderation queue (sorted by FIRE score, lowest first)
4. Override scores with optional notes

### Article Submission
- Use frontend form at `/submit`
- Or POST to API: `http://localhost:8080/api/v1/partner/submit`

## 🔌 API Endpoints

```
POST   /api/v1/partner/submit          Submit article + get FIRE score
GET    /api/v1/articles                List all articles
GET    /api/v1/articles/{id}           Get single article
POST   /api/v1/articles/{id}/report    Report article
GET    /api/v1/moderator/queue         Get moderation queue
POST   /api/v1/moderator/override      Override FIRE score
```

## 🧪 Model Details

- **Base Model**: DistilBERT (distilbert-base-uncased)
- **Training Data**: ISOT Fake News Dataset (44,898 articles, 2016-2017)
- **Task**: Binary classification (real/fake news)
- **Version**: v1.0.0 (tracked per article in database)
- **Performance**: 97% of BERT performance at 60% size

### FIRE Score Calculation
```python
if prediction == 1 (real):
    score = 50 + (confidence * 50)  # Range: 50-100
else:  # fake
    score = 50 - (confidence * 50)  # Range: 0-50
```

## 📚 Documentation

- **Model Card**: Visit `/model-card` - DistilBERT specs, training details, metrics
- **Data Card**: Visit `/data-card` - ISOT dataset details, biases, limitations

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Model file only 130 bytes? | Install Git LFS: `git lfs install && git lfs pull` |
| "Cannot connect to backend" | Ensure backend running: `cd backend && go run main.go` |
| "Firebase permission denied" | Check `firebase-credentials.json` in `backend/` directory |
| "Python not found" | Set path: `$env:PYTHON_PATH="python"` (PowerShell) |
| Article submission timeout? | ML inference takes ~5-20s on first run (model loading) |

## 👥 Team

Alonso Geesink Antón
Claudio Catalano Leiva
Seyit Inci

## 📄 License

Educational project - Apache 2.0 (DistilBERT model)
