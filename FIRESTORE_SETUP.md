# Firebase Firestore Setup Guide

## Overview
The backend uses Firebase Firestore to store submitted articles and their FIRE scores.

## Prerequisites
- Access to the Firebase Console for the `deeplearningmilestone3` project
- Admin privileges to generate service account credentials

---

## Step 1: Get Firebase Service Account Credentials

### 1.1 Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select the **deeplearningmilestone3** project

### 1.2 Navigate to Project Settings
1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Select **Project settings**

### 1.3 Generate Service Account Key
1. Go to the **Service Accounts** tab
2. Click **Generate new private key**
3. Click **Generate key** in the confirmation dialog
4. A JSON file will download automatically

### 1.4 Save Credentials File
1. Rename the downloaded file to `firebase-credentials.json`
2. Move it to the `backend/` directory:
   ```
   DLGroup1Milestone3/
   └── backend/
       ├── firebase-credentials.json  ← Place here
       ├── main.go
       ├── go.mod
       └── ...
   ```

⚠️ **IMPORTANT**: The file `firebase-credentials.json` is already in `.gitignore` and should NEVER be committed to Git!

---

## Step 2: Verify Firestore Database

### 2.1 Check Firestore is Enabled
1. In Firebase Console, click **Firestore Database** in the left sidebar
2. If not enabled, click **Create database**
3. Select **Start in test mode** (or production mode if preferred)
4. Choose a Cloud Firestore location (us-central1 recommended)

### 2.2 Collection Structure
The backend will automatically create the following structure:

**Collection: `articles`**
```
articles/
  └── {document_id}/
      ├── title: string
      ├── content: string
      ├── url: string
      ├── source: string
      ├── author: string
      ├── published_at: timestamp
      ├── submitted_at: timestamp
      └── fire_score: number (0-100)
```

---

## Step 3: Test Database Connection

### 3.1 Start the Backend
```bash
cd backend
go run main.go
```

### 3.2 Look for Success Message
You should see:
```
✅ Connected to Firestore
✅ Server running on http://localhost:8080
```

### 3.3 Submit a Test Article
Use the frontend or `curl`:
```bash
curl -X POST http://localhost:8080/api/v1/partner/submit \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "This is test content for the FIRE score analysis.",
    "url": "https://example.com",
    "source": "Test Source",
    "author": "Test Author",
    "publishedAt": "2024-01-01"
  }'
```

### 3.4 Verify in Firebase Console
1. Go to **Firestore Database** in Firebase Console
2. Click the **articles** collection
3. You should see your submitted article with all fields

---

## Troubleshooting

### Error: "Failed to initialize Firestore"
- **Check**: Is `firebase-credentials.json` in the `backend/` directory?
- **Check**: Is the file valid JSON? Open it in a text editor.
- **Check**: Does your Firebase account have access to the project?

### Error: "Permission denied"
- **Fix**: Update Firestore security rules in Firebase Console:
  ```javascript
  // Allow server-side access (using service account)
  service cloud.firestore {
    match /databases/{database}/documents {
      match /articles/{document=**} {
        allow read, write: if true;  // For development only
      }
    }
  }
  ```

### Articles not appearing in GET /api/v1/articles
- **Check**: Are articles successfully saved? Look for "Article saved to Firestore" in backend logs
- **Check**: Run the POST request again and verify the response includes `article_id`

---

## Security Notes

### For Development (Current Setup)
- Using test mode Firestore rules (allow all)
- Service account has full admin access
- Frontend doesn't directly access Firestore (only through backend API)

### For Production (If Deploying)
- Use production mode Firestore rules
- Restrict service account permissions
- Enable Firebase App Check
- Add rate limiting to API endpoints

---

## Environment Variables (Optional)

Instead of placing credentials in `backend/`, you can use an environment variable:

**Windows PowerShell:**
```powershell
$env:FIREBASE_CREDENTIALS="C:\path\to\firebase-credentials.json"
cd backend
go run main.go
```

**Linux/Mac:**
```bash
export FIREBASE_CREDENTIALS="/path/to/firebase-credentials.json"
cd backend
go run main.go
```

---

## Database Schema Details

### Article Fields
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `title` | string | Article headline | ✅ |
| `content` | string | Article body text | ✅ |
| `url` | string | Source URL | ❌ |
| `source` | string | Publisher name | ✅ |
| `author` | string | Author name | ❌ |
| `published_at` | timestamp | Original publication date | ✅ |
| `submitted_at` | timestamp | When submitted to our system | ✅ Auto |
| `fire_score` | number | FIRE score (0-100) | ✅ Auto |

### Derived Fields (Calculated, Not Stored)
- `label`: "real" (score ≥ 50) or "fake" (score < 50)
- `category`: "No risk detected" (≥70), "Unverified" (35-69), "Likely misleading" (<35)

---

## Next Steps
Once Firestore is set up:
1. ✅ Backend saves articles to database
2. ✅ Frontend can retrieve articles via GET /api/v1/articles
3. ✅ Dashboard displays all submitted articles
4. ✅ Full-stack persistence working

Happy coding! 🚀
