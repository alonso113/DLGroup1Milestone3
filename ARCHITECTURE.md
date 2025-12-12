# FIRE News Aggregator - Architecture Overview

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      USER BROWSER                          │
│                   http://localhost:3000                    │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ HTTP/REST
                     ▼
┌────────────────────────────────────────────────────────────┐
│                  REACT FRONTEND (Port 3000)                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Pages:                                               │ │
│  │  • Dashboard (/)           - Browse articles         │ │
│  │  • ArticlePage (/:id)      - Read & report          │ │
│  │  • ModeratorConsole        - Review & override      │ │
│  │  • SubmitArticle           - Test submissions       │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Components:                                          │ │
│  │  • FIREBadge    - Color-coded risk indicators       │ │
│  │  • ArticleCard  - Article previews                  │ │
│  │  • Header       - Navigation                        │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Services:                                            │ │
│  │  • articleService   - Article API calls             │ │
│  │  • moderatorService - Moderator API calls           │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ HTTP/REST API calls
                     ▼
┌────────────────────────────────────────────────────────────┐
│              GO BACKEND (Port 8080) - TO BUILD             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ HTTP Handlers:                                       │ │
│  │  GET  /api/v1/articles          - List articles     │ │
│  │  GET  /api/v1/articles/:id      - Get article       │ │
│  │  POST /api/v1/articles/:id/report - Report         │ │
│  │  POST /api/v1/partner/submit    - Submit article    │ │
│  │  GET  /api/v1/moderator/queue   - Get queue        │ │
│  │  POST /api/v1/moderator/override - Override        │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Business Logic:                                      │ │
│  │  • Article management                               │ │
│  │  • FIRE score categorization                        │ │
│  │  • Report handling                                  │ │
│  │  • Moderation queue                                 │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────┬────────────────┬───────────────────────────┘
                 │                │
                 │                │ Python subprocess call
                 ▼                ▼
┌────────────────────────┐  ┌─────────────────────────────────┐
│  POSTGRESQL DATABASE   │  │   PYTHON ML SERVICE             │
│  (Port 5432)           │  │                                 │
│  ┌──────────────────┐  │  │  ┌───────────────────────────┐ │
│  │ Tables:          │  │  │  │ predict.py                │ │
│  │  • articles      │  │  │  │  - Load model.pkl         │ │
│  │  • fire_scores   │  │  │  │  - Preprocess text        │ │
│  │  • user_reports  │  │  │  │  - Return score (0-100)   │ │
│  │  • moderator_    │  │  │  │  - Return label (real/fake)│ │
│  │    overrides     │  │  │  │  - Return confidence      │ │
│  └──────────────────┘  │  │  └───────────────────────────┘ │
└────────────────────────┘  │  ┌───────────────────────────┐ │
                            │  │ Your Trained Model         │ │
                            │  │  fire_model.pkl            │ │
                            │  └───────────────────────────┘ │
                            └─────────────────────────────────┘
```

## Data Flow

### 1. Article Display Flow
```
User opens browser
    ↓
Frontend loads Dashboard
    ↓
GET /api/v1/articles
    ↓
Backend queries PostgreSQL
    ↓
Returns articles + FIRE scores
    ↓
Frontend displays with FIREBadge components
```

### 2. Article Submission Flow
```
User submits article form
    ↓
POST /api/v1/partner/submit
    ↓
Backend saves article to PostgreSQL
    ↓
Backend calls Python predict.py
    ↓
Python loads model and predicts
    ↓
Returns score, label, confidence
    ↓
Backend saves FIRE score to database
    ↓
Returns result to frontend
    ↓
Frontend displays success + FIRE score
```

### 3. Report Flow
```
User clicks "Report" on article
    ↓
POST /api/v1/articles/:id/report
    ↓
Backend saves report to database
    ↓
Returns success
    ↓
Frontend shows confirmation
```

### 4. Moderator Override Flow
```
Moderator opens console
    ↓
GET /api/v1/moderator/queue
    ↓
Backend queries articles with score < 50
    ↓
Returns prioritized queue
    ↓
Moderator clicks "Override"
    ↓
POST /api/v1/moderator/override
    ↓
Backend saves override to database
    ↓
Returns success
```

## FIRE Score Logic

```
Score Calculation (in Python):
┌─────────────────────────────┐
│ Input: Article text         │
│  • Headline                 │
│  • Body                     │
│  • Metadata (optional)      │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Your Trained Model          │
│  • Preprocessing            │
│  • Feature extraction       │
│  • Neural network inference │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Raw Output                  │
│  • Probability (0.0-1.0)    │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Formatted Response          │
│  • Score: 0-100             │
│  • Label: fake/real         │
│  • Confidence: 0.0-1.0      │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Backend Categorization      │
│  • < 35: Likely misleading  │
│  • 35-49: Unverified        │
│  • 50-100: No risk detected │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Frontend Display            │
│  • Red badge (< 35)         │
│  • Yellow badge (35-49)     │
│  • Green badge (50-100)     │
└─────────────────────────────┘
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI components & pages |
| | Vite | Fast dev server & bundling |
| | React Router | Client-side routing |
| | Axios | HTTP requests |
| | Tailwind CSS | Styling |
| **Backend** | Go + Gin | REST API server |
| | PostgreSQL | Relational database |
| | Python subprocess | ML inference |
| **ML** | Your trained model | FIRE score prediction |
| | Python + pickle | Model loading |
| **DevOps** | Docker | Containerization |
| | Docker Compose | Service orchestration |

## Current Status

✅ **Frontend** - COMPLETE
- All pages built
- All components created
- API integration ready
- TypeScript types defined
- Responsive design
- Error handling

⏳ **Backend** - NEXT STEP
- Need to create Go services
- Need to set up PostgreSQL
- Need to integrate Python model
- Need to implement API endpoints

⏳ **ML Integration** - PENDING
- Need to create predict.py wrapper
- Need to copy your model binary
- Need to handle preprocessing

⏳ **Deployment** - PENDING
- Need Docker Compose setup
- Need environment configuration
- Need database migrations

## Next Steps

1. **Install Node.js** and run `npm install` in the `frontend` directory
2. **Create backend** using the Go structure outlined above
3. **Add your ML model** to the `ml` directory
4. **Set up Docker Compose** to run everything together
5. **Test the full stack** with your trained model

---

**The frontend is ready and waiting! Time to build the backend! 🚀**
