# User Report & Moderation Queue Feature

## Overview
Users can now report articles with suspicious FIRE scores, which flags them for moderator review.

---

## Database Changes

### New Field: `needs_moderation`
All articles in Firestore now have a `needs_moderation` field:
- **Type**: boolean
- **Default**: `false` (set when article is first submitted)
- **Purpose**: Tracks if an article has been reported and needs moderator review

---

## Backend Implementation

### 1. Firestore Service Updates

**File**: `backend/internal/services/firestore_service.go`

#### New Functions:
- **`ReportArticle(articleID string)`** - Sets `needs_moderation: true`
- **`GetModeratorQueue(limit int)`** - Retrieves articles where `needs_moderation == true`, sorted by `fire_score` ascending (worst/lowest scores first)

#### Updated Function:
- **`SaveArticle()`** - Now initializes `needs_moderation: false` for all new articles

### 2. Handler Updates

**File**: `backend/internal/handlers/article_handler.go`

#### New Endpoints:
- **`POST /api/v1/articles/{id}/report`** - Report an article for moderation
- **`GET /api/v1/moderator/queue`** - Get moderation queue (protected endpoint for moderators)

### 3. Routes

**File**: `backend/main.go`

Added routes:
```go
api.HandleFunc("/articles/{id}/report", articleHandler.ReportArticle).Methods("POST", "OPTIONS")
api.HandleFunc("/moderator/queue", articleHandler.GetModeratorQueue).Methods("GET", "OPTIONS")
```

---

## Frontend Implementation

### Updated Services

**File**: `frontend/src/services/moderatorService.ts`

- **`getQueue()`** - Now returns `Article[]` sorted by FIRE score (lowest first)
- Uses same Article type as the main feed

**File**: `frontend/src/services/articleService.ts`

- **`reportArticle(articleId, reason)`** - Already exists, now functional with backend

---

## How It Works

### User Flow:
1. User views an article on the Dashboard or Article Page
2. User clicks **"🚩 Report Incorrect FIRE Score"** button
3. User enters a reason (optional)
4. Frontend calls `POST /api/v1/articles/{id}/report`
5. Backend sets `needs_moderation: true` in Firestore
6. Article appears in moderator queue

### Moderator Flow:
1. Moderator logs in and navigates to `/mod` (Moderator Console)
2. Frontend calls `GET /api/v1/moderator/queue`
3. Backend returns articles where `needs_moderation: true`, sorted by fire_score ascending
4. **Lowest FIRE scores appear first** (most suspicious articles at the top)
5. Moderator can review and take action

---

## Firebase Index Required

To use the moderation queue query, you need a composite index in Firestore:

### Create Index:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `deeplearningmilestone3` project
3. Firestore Database → **Indexes** tab → **Create Index**
4. Configure:
   - **Collection ID**: `articles`
   - **Fields**:
     - `needs_moderation` | Ascending
     - `fire_score` | Ascending
5. Click **Create**

**Or** if the backend shows an error with an index creation URL, just click that URL.

---

## API Endpoints

### Report Article
```http
POST /api/v1/articles/{id}/report
Content-Type: application/json

{
  "reason": "This article seems biased and the FIRE score is too high"
}
```

**Response**:
```json
{
  "message": "Article reported successfully"
}
```

### Get Moderation Queue
```http
GET /api/v1/moderator/queue
```

**Response**:
```json
[
  {
    "id": "abc123",
    "title": "Article Title",
    "content": "...",
    "source": "News Source",
    "fire_score": {
      "score": 15,
      "confidence": 0.70,
      "label": "fake",
      "category": "Likely misleading"
    },
    ...
  }
]
```

**Note**: Articles sorted by `fire_score` ascending (lowest scores first)

---

## Testing

### Test User Report:
1. Start backend: `cd backend && go run main.go`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser to `http://localhost:3000`
4. Click on any article
5. Click **"🚩 Report Incorrect FIRE Score"**
6. Enter a reason and submit

### Test Moderation Queue:
1. Login as moderator (navigate to `/mod`)
2. The queue should show reported articles
3. Articles with **lowest FIRE scores** appear at the top
4. Verify articles are sorted correctly

### Backend Logs:
Look for:
```
📢 Reporting article {id} for moderation. Reason: {reason}
Article {id} marked for moderation
Retrieved {count} articles needing moderation
```

---

## Next Steps (Optional Enhancements)

1. **Track report count**: Add a counter to see how many users reported each article
2. **Store report reasons**: Save user-submitted reasons in a subcollection
3. **Moderator actions**: Add approve/reject buttons that clear `needs_moderation` flag
4. **Report history**: Show who reported articles and when
5. **Email notifications**: Notify moderators when articles are reported

---

## Summary

✅ **New Articles**: Initialize with `needs_moderation: false`  
✅ **User Reports**: Set `needs_moderation: true` via report button  
✅ **Moderation Queue**: Shows reported articles sorted by FIRE score (lowest first)  
✅ **Frontend Integration**: Report button functional, moderator queue updated  
✅ **Backend Routes**: `/articles/{id}/report` and `/moderator/queue` working  

Happy moderating! 🛡️
