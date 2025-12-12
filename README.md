# FIRE News Aggregator

A comprehensive news aggregation and verification platform with Deep Learning-powered fake news detection.

## Project Overview

The FIRE (Fake Information Risk Evaluation) News Aggregator uses a deep learning model to assess the credibility of news articles and provide readers with risk scores to help them navigate today's information landscape.

### Features

- 📰 **News Feed**: Browse aggregated news articles with real-time FIRE scores
- 🎯 **Risk Assessment**: ML-powered scoring (0-100) categorizing articles as:
  - ✅ No risk detected (50-100)
  - ⚡ Unverified (35-49)
  - ⚠️ Likely misleading (<35)
- 🚩 **User Reports**: Readers can report incorrect FIRE scores
- 👮 **Moderator Console**: Review queue for human oversight
- 📤 **Article Submission**: Partner API for external publishers
- 🔍 **Detailed View**: Full article reading with FIRE explanations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling

### Backend (Coming Next)
- **Go** for high-performance API services
- **PostgreSQL** for data persistence
- **Python** for ML model inference
- **Docker** for containerization

## Project Structure

```
DLGroup1Milestone3/
├── frontend/                 # React + TypeScript application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── common/       # FIREBadge, ArticleCard, etc.
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ArticlePage.tsx
│   │   │   ├── ModeratorConsole.tsx
│   │   │   └── SubmitArticle.tsx
│   │   ├── services/         # API service layer
│   │   └── types/            # TypeScript definitions
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