# Firebase Authentication Setup Guide

## Creating the Moderator Account

Since Firebase is already installed and configured, you just need to create a moderator user account.

### Option 1: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **deeplearningmilestone3**
3. Click on **Authentication** in the left sidebar
4. Click on the **Users** tab
5. Click **Add user** button
6. Enter the credentials:
   - **Email**: `moderator@fire-news.com`
   - **Password**: `moderator123` (or any password you prefer)
7. Click **Add user**

That's it! The moderator account is now ready to use.

### Option 2: Using Firebase CLI (Alternative)

If you have Firebase CLI installed:

```bash
firebase auth:import users.json --project deeplearningmilestone3
```

Where `users.json` contains:
```json
{
  "users": [{
    "localId": "moderator-001",
    "email": "moderator@fire-news.com",
    "passwordHash": "...",
    "salt": "...",
    "emailVerified": true
  }]
}
```

## Testing the Authentication

1. Start your frontend: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Try to access `http://localhost:3000/mod` - you'll be redirected to login
4. Enter the moderator credentials
5. You should be logged in and redirected to the Moderator Console
6. The header now shows "Moderator Console" link and "Logout" button

## How It Works

### For Regular Users:
- Visit `http://localhost:3000`
- See: News Feed, Submit Article (no moderator link)
- Can browse and read articles freely
- Can submit articles
- Can report articles

### For Moderators:
- Visit `http://localhost:3000/mod` (or type it directly)
- Redirected to `/login`
- Enter credentials
- After login:
  - Header shows "Moderator Console" link
  - Header shows "Logout" button
  - Can access moderator console
  - Can override FIRE scores

## Firebase Configuration

Your Firebase project is already configured in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDqSrlpF-tqHB7N2RMRvGM9gRxlzzC0C4c",
  authDomain: "deeplearningmilestone3.firebaseapp.com",
  projectId: "deeplearningmilestone3",
  storageBucket: "deeplearningmilestone3.firebasestorage.app",
  messagingSenderId: "916983776074",
  appId: "1:916983776074:web:dd55d4b7841d12b3aaf7b3"
};
```

## Security Notes

For your demo/development purposes, this setup is perfect. The credentials shown in the login page are just for convenience during development.

In a production environment, you would:
- Remove the demo credentials display
- Add password reset functionality
- Add email verification
- Use environment variables for Firebase config

## Troubleshooting

### "Cannot find module 'firebase/auth'"
The Firebase package should already be installed. If you see this error:
```bash
cd frontend
npm install firebase
```

### Login not working
1. Check Firebase Console > Authentication is enabled
2. Make sure Email/Password sign-in method is enabled in Firebase Console
3. Verify the user account exists
4. Check browser console for errors

### Redirects not working
- Clear your browser cache and cookies
- Try in an incognito/private window
- Check that the routes in `App.tsx` are correct

## What's Been Implemented

✅ Firebase SDK installed and configured
✅ AuthContext for global auth state
✅ Login page with form validation
✅ Protected route for moderator console
✅ Conditional header links (show/hide based on auth)
✅ Logout functionality
✅ Loading states during auth checks
✅ Error handling for failed logins

## Files Created/Modified

- `src/config/firebase.ts` - Firebase initialization
- `src/context/AuthContext.tsx` - Auth state management
- `src/components/auth/ProtectedRoute.tsx` - Route protection
- `src/pages/Login.tsx` - Login page
- `src/components/common/Header.tsx` - Updated with auth awareness
- `src/App.tsx` - Updated routes with protection

The authentication system is now fully integrated and ready to use!
