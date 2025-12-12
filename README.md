# FIRE News Aggregator

A comprehensive news aggregation and verification platform with Deep Learning-powered fake news detection.

## Project Overview

The FIRE (Fake Information Risk Evaluation) News Aggregator uses a deep learning model to assess the credibility of news articles and provide readers with risk scores to help them navigate today's information landscape.

### Features

- 📰 **News Feed**: Browse aggregated news articles with real-time FIRE scores
- 🎯 **Risk Assessment**: ML-powered scoring (0-100) categorizing articles as:
  - ✅ No risk detected (0-49)
  - ⚡ Unverified (50-69)
  - ⚠️ Likely misleading (70-100)
- 🚩 **User Reports**: Readers can report incorrect FIRE scores
- 👮 **Moderator Console**: Review queue for human oversight (Firebase authenticated)
- 📤 **Article Submission**: Partner API for external publishers
- 🔍 **Detailed View**: Full article reading with FIRE explanations

## ⚠️ Prerequisites for Team Members

Before cloning this repository, you **MUST** install Git LFS:

### Install Git LFS

**Windows:**
```bash
# Download and install from: https://git-lfs.github.com/
# Or use Chocolatey:
choco install git-lfs
```

**Mac:**
```bash
brew install git-lfs
```

**Linux:**
```bash
sudo apt-get install git-lfs
```

**After installation:**
```bash
git lfs install
```

### Why Git LFS?

This project uses **Git Large File Storage (LFS)** to manage the trained ML model file (`bestmodel_3_run5.pt`, ~250MB). Without Git LFS, you won't be able to clone or pull the model file properly.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/alonso113/DLGroup1Milestone3.git
cd DLGroup1Milestone3

# Verify Git LFS downloaded the model
ls -lh backend/ml/bestmodel_3_run5.pt
# Should show ~250MB, not 130 bytes
```

If the model file is only 130 bytes, you forgot to install Git LFS! Run `git lfs install` and `git lfs pull`.

### 2. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at **http://localhost:3000**

### 3. Set Up the Backend

**Prerequisites:**
- Go 1.21+ ([download](https://go.dev/dl/))
- Python 3.8+ with pip

**Install dependencies:**
```bash
cd backend

# Go dependencies
go mod tidy

# Python dependencies
cd ml
pip install -r requirements.txt
cd ..
```

**Run the server:**
```bash
go run main.go
```

Backend will be available at **http://localhost:8080**

### 4. (Optional) Set Up Firebase Authentication

See [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md) for instructions on setting up the moderator authentication.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Firebase Auth** for moderator authentication

### Backend
- **Go 1.21+** for high-performance API services
- **DistilBERT** (fine-tuned) for fake news detection
- **PyTorch + Transformers** for ML inference
- **Python 3.8+** for model integration

## Project Structure

```
DLGroup1Milestone3/
├── frontend/                 # React + TypeScript application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # FIREBadge, ArticleCard, Header, etc.
│   │   │   └── auth/         # ProtectedRoute
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ArticlePage.tsx
│   │   │   ├── ModeratorConsole.tsx
│   │   │   ├── SubmitArticle.tsx
│   │   │   └── Login.tsx
│   │   ├── services/         # API service layer
│   │   ├── context/          # Auth context
│   │   └── types/            # TypeScript definitions
├── backend/                  # Go backend
│   ├── main.go              # Server entry point
│   ├── internal/
│   │   ├── handlers/        # HTTP request handlers
│   │   ├── services/        # Business logic (ML service)
│   │   └── models/          # Data structures
│   └── ml/
│       ├── predict.py       # Python ML inference script
│       ├── bestmodel_3_run5.pt  # Trained DistilBERT model (Git LFS)
│       └── requirements.txt
└── .gitattributes           # Git LFS configuration
│   └── package.json
│
├── backend/                  # Go backend (to be created)
├── ml/                       # ML model files (to be created)
└── docs/                     # Documentation
```

## Getting Started

### Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access the app at http://localhost:3000
```

### Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8080/api/v1
```

## Development Timeline

**Week 1**: Backend + Database (Go services, PostgreSQL, ML integration)  
**Week 2**: Frontend ✅ (COMPLETED)  
**Week 3**: Integration, Testing, and Demo Prep

## Pages

1. **Dashboard** (`/`) - Main news feed with FIRE badges
2. **Article Page** (`/article/:id`) - Full article view with report functionality
3. **Moderator Console** (`/moderator`) - Queue management and override tools
4. **Submit Article** (`/submit`) - Partner API interface for testing

## Requirements Met

### Functional Requirements
- ✅ FR-6: Reader UI displays FIRE badges
- ✅ FR-7: Users can report incorrect predictions
- ✅ FR-8: Moderator console with sorted queue
- ✅ FR-9: Override functionality with notes
- ✅ FR-10: Article submission interface

### Non-Functional Requirements
- ✅ NFR-2: Fast UI load times (<5s target)
- ✅ Clean, responsive design
- ✅ Type-safe code with TypeScript

## Team

- Seyit
- Alonso  
- Claudio

## License

University Project - 2025