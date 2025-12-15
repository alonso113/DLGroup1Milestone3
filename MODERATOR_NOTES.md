# Moderator Notes Feature

## Overview
Moderators can override article FIRE scores and add optional notes explaining their decision. Notes are stored in a `mod_notes` subcollection under each article.

---

## Database Structure

### Main Collection: `articles`
- Standard article fields (title, content, fire_score, etc.)

### Subcollection: `mod_notes` (under each article)
Each document in `mod_notes` contains:
- **`note_1`**, **`note_2`**, **`note_3`**, etc. - The moderator's note text
- **`label`** - The override label ("real" or "fake")
- **`timestamp`** - When the note was created

### Example Structure:
```
articles/
  └── {article_id}/
      ├── title: "Article Title"
      ├── fire_score: 45
      ├── needs_moderation: true
      └── mod_notes/ (subcollection)
          ├── {auto_id_1}/
          │   ├── note_1: "This source is actually reliable"
          │   ├── label: "real"
          │   └── timestamp: 2025-12-15T10:30:00Z
          └── {auto_id_2}/
              ├── note_2: "Updated classification after review"
              ├── label: "real"
              └── timestamp: 2025-12-15T14:00:00Z
```

---

## Backend Implementation

### Firestore Service

**File**: `backend/internal/services/firestore_service.go`

#### New Function: `SaveModeratorNote()`
```go
func (s *FirestoreService) SaveModeratorNote(articleID string, note string, newLabel string) error
```

**How it works:**
1. Checks if note is empty (skip if no note provided)
2. Gets reference to `mod_notes` subcollection under the article
3. Counts existing notes to determine next note number
4. Creates field name: `note_1`, `note_2`, etc.
5. Adds document with:
   - Dynamic note field (`note_N`)
   - Override label
   - Timestamp
6. Logs the action

**Note Numbering:**
- First override with note → `note_1`
- Second override with note → `note_2`
- And so on...

### Handler

**File**: `backend/internal/handlers/article_handler.go`

#### New Endpoint: `OverrideFIREScore()`
- **Route**: `POST /api/v1/moderator/override`
- **Request Body**:
  ```json
  {
    "article_id": "abc123",
    "new_label": "real",
    "notes": "Optional moderator explanation"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Override saved successfully"
  }
  ```

**Flow:**
1. Parse request (article_id, new_label, notes)
2. Validate required fields
3. If notes provided → call `SaveModeratorNote()`
4. Return success

---

## Frontend Integration

### Moderator Console
**File**: `frontend/src/pages/ModeratorConsole.tsx`

Already has override modal with:
- Radio buttons: "Real News" / "Fake News"
- Optional textarea for notes
- Calls `moderatorService.overrideFIREScore()`

### Moderator Service
**File**: `frontend/src/services/moderatorService.ts`

```typescript
async overrideFIREScore(override: ModeratorOverrideRequest): Promise<void> {
  await api.post('/moderator/override', override);
}
```

---

## Usage Flow

### Moderator Workflow:
1. Login to `/mod`
2. See reported articles in moderation queue
3. Click "Override" button on an article
4. Modal appears:
   - Select new label (Real News / Fake News)
   - Optionally enter notes explaining the decision
5. Click "Save Override"
6. Backend saves the note to `mod_notes` subcollection

### Note Storage:
- **First override** → Creates `mod_notes` subcollection, adds document with `note_1`
- **Second override** → Adds new document with `note_2`
- **Third override** → Adds new document with `note_3`
- etc.

---

## API Endpoint

### Override FIRE Score
```http
POST /api/v1/moderator/override
Content-Type: application/json

{
  "article_id": "vZv7R4ml5DLxWKA0kj18",
  "new_label": "real",
  "notes": "This article is from CBS Sports, a reputable source. The FIRE score was too low."
}
```

**Response** (Success):
```json
{
  "message": "Override saved successfully"
}
```

**Response** (Error):
```json
{
  "error": "article_id and new_label are required"
}
```

---

## Testing

### Test Moderator Override with Note:
1. Start backend: `cd backend && go run main.go`
2. Start frontend: `cd frontend && npm run dev`
3. Login to moderator console (`/mod`)
4. Click "Override" on an article
5. Select "Real News"
6. Enter note: "Verified source, accurate content"
7. Click "Save Override"
8. Check Firebase Console → articles → {article_id} → mod_notes subcollection

### Test Multiple Notes:
1. Override same article again with different note
2. Check Firebase: should see two documents in `mod_notes`
3. First document has `note_1`, second has `note_2`

### Backend Logs:
Look for:
```
🛡️ Moderator override for article {id}: new_label=real, has_notes=true
Saved moderator note for article {id}: note_1=This source is reliable
```

---

## Future Enhancements

1. **Display Notes**: Show mod notes history in article detail page
2. **Update FIRE Score**: Actually change the article's fire_score based on override
3. **Track Overridden Articles**: Add `overridden: true` flag to articles
4. **Store Original Score**: Keep original ML prediction for reference
5. **Clear Moderation Flag**: Set `needs_moderation: false` after override
6. **Moderator Attribution**: Store which moderator made the override
7. **Note Editing**: Allow moderators to edit their notes

---

## Summary

✅ **Backend**: `SaveModeratorNote()` creates/appends to `mod_notes` subcollection  
✅ **Handler**: `OverrideFIREScore()` saves note when provided  
✅ **Route**: `POST /moderator/override` endpoint added  
✅ **Frontend**: Moderator console sends notes via existing modal  
✅ **Storage**: Notes numbered sequentially (`note_1`, `note_2`, etc.)  
✅ **Subcollection**: Automatically created if doesn't exist  

Notes are optional - moderators can override without adding a note!
