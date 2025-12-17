# FIRE News Aggregator

> **F**ake **I**nformation **R**isk **E**valuation - A Deep Learning-powered news verification platform

A full-stack application that uses a fine-tuned DistilBERT model to assess news article credibility and provide risk scores (0-100) to help readers determine reliability.

## Quick Start (Docker - Easiest)

### Option 1: Pull Prebuilt Images from DockerHub (No Git LFS Needed)

```bash
# 1. Clone the repository (no Git LFS required)
git clone https://github.com/alonso113/DLGroup1Milestone3.git
cd DLGroup1Milestone3

# 2. Start services (images will be pulled from DockerHub)
docker-compose up

# Access the application at http://localhost:3000
```
---

### Option 2: Build Images Locally (Requires Git LFS)

#### Prerequisites
- **Docker** and **Docker Compose** - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Git LFS** (for 250MB model file) - [Install](https://git-lfs.github.com/)

#### Installation

```bash
# 1. Clone repository with Git LFS
git lfs install
git clone https://github.com/alonso113/DLGroup1Milestone3.git
cd DLGroup1Milestone3

# Verify model downloaded (should be ~250MB, not 130 bytes)
ls -lh backend/ml/bestmodel_3_run5.pt

# 2. Start services (builds images locally)
docker-compose up --build

# Access the application at http://localhost:3000
```

---

## Manual Setup (Alternative)

If you prefer running services locally without Docker:

### Prerequisites
- **Git LFS** (for 250MB model file) - [Install](https://git-lfs.github.com/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Go 1.21+** - [Download](https://go.dev/dl/)
- **Python 3.8+** with pip

### Installation

```bash
# 1. Clone repository (requires Git LFS installed first)
git lfs install
git clone https://github.com/alonso113/DLGroup1Milestone3.git
cd DLGroup1Milestone3

# Verify model downloaded (should be ~250MB, not 130 bytes)
ls -lh backend/ml/bestmodel_3_run5.pt

# 2. Start Backend 
cd backend
go mod tidy
cd ml && pip install -r requirements.txt && cd ..
go run main.go

# 3. Start Frontend (new terminal)
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## Features

- **News Feed** - Browse articles with FIRE scores
- **ML Risk Assessment** - DistilBERT-powered scoring (0-100)
  - 🟢 50-100: Real news (low risk)
  - 🟡 35-49: Unverified
  - 🔴 0-34: Likely misleading (high risk)
- **User Reporting** - Flag incorrect scores for review
- **Moderator Console** - Review queue with override capabilities
- **Moderator Notes** - Track override decisions for model retraining
- **Firebase Authentication** - Secure moderator-only access
- **Model & Data Cards** - Full transparency documentation

## Architecture

### System Architecture
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │────▶│   Go API     │─────▶│  Python ML  │
│  Frontend   │      │   Backend    │      │  (PyTorch)  │
│  Port 3000  │◀────│   Port 8080  │◀─────│  DistilBERT │
└─────────────┘      └──────┬───────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Firestore  │
                     │  Database   │
                     └─────────────┘
```

### Docker Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Docker Host                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │         fire-network (Bridge Network)         │  │
│  │                                               │  │
│  │  ┌────────────────┐      ┌──────────────────┐ │  │
│  │  │   Frontend     │      │     Backend      │ │  │
│  │  │                │      │                  │ │  │
│  │  │ React + Nginx  │─────▶│  Go + Python ML │ │  │
│  │  │ Port: 3000     │      │  Port: 8080      │ │  │
│  │  └────────────────┘      └──────────────────┘ │  │
│  │         │                         │           │  │
│  └─────────┼─────────────────────────┼───────────┘  │
│            │                         │              │ 
└────────────┼─────────────────────────┼──────────────┘
             │                         │
             ▼                         ▼
     localhost:3000            Firestore (public rules)
```

### Tech Stack

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Nginx + Firebase Auth  
**Backend**: Go 1.24 + Gorilla Mux  
**ML**: Python + PyTorch + Transformers (DistilBERT)  
**Database**: Firebase Firestore (public read/write rules)  
**Model**: 250MB trained model (Git LFS tracked)  
**Deployment**: Docker + Docker Compose

> **Note**: This project uses **public Firebase Firestore rules** that allow anyone to read/write data without authentication. This is configured for demo purposes. The backend connects directly to Firestore without requiring service account credentials.

### Container Details

**Frontend Container:**
- Multi-stage build: `node:18-alpine` (builder) → `nginx:alpine` (runtime)
- Builds React app with Vite, serves via Nginx
- Proxies `/api/*` requests to backend
- Size: ~500MB

**Backend Container:**
- Multi-stage build: `golang:1.21-alpine` (builder) → `python:3.11-slim` (runtime)
- Compiles Go binary, installs Python ML dependencies
- Includes 250MB DistilBERT model
- Size: ~1.5GB

##  Usage

### Public User Flow
1. Visit http://localhost:3000
2. Browse news feed with FIRE scores
3. Click article to read full content
4. Report incorrect scores

### Moderator Flow
1. Navigate to `/mod` → Redirected to login
2. Login: `moderator@fire-news.com` / `moderator123`
3. View moderation queue (sorted by FIRE score, lowest first)
4. Override scores with optional notes (notes stored in database for future ml developers to see)

### Article Submission
- Use frontend form at `/submit`
- Or POST to API: `http://localhost:8080/api/v1/partner/submit`

## API Endpoints

```
POST   /api/v1/partner/submit          Submit article + get FIRE score
GET    /api/v1/articles                List all articles
GET    /api/v1/articles/{id}           Get single article
POST   /api/v1/articles/{id}/report    Report article
GET    /api/v1/moderator/queue         Get moderation queue
POST   /api/v1/moderator/override      Override FIRE score
```

## Model Details

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

## Documentation

- **Model Card**: Visit `/model-card` - DistilBERT specs, training details, metrics
- **Data Card**: Visit `/data-card` - ISOT dataset details, biases, limitations

## Team

Group 1:
Alonso Geesink Antón, 
Claudio Catalano Leiva, 
Seyit Inci

