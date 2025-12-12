# Authentication System Documentation

## Overview

A mock authentication system using localStorage for role-based access control. Perfect for demo purposes - shows authentication concepts without backend complexity.

## Demo Accounts

### Reader Accounts
```
Username: reader
Password: reader123
Role: Reader (Basic User)

Username: john
Password: password
Role: Reader (Basic User)
```

### Moderator Account
```
Username: moderator
Password: mod123
Role: Moderator (Full Access)
```

## Features

### ✅ Role-Based Access Control
- **Readers**: Can browse articles, view FIRE scores, report issues
- **Moderators**: All reader permissions + access to moderator console

### ✅ Protected Routes
- Moderator Console (`/moderator`) - **Moderator only**
- Other pages accessible to all users (including guests)

### ✅ User Interface
- Login/Logout in header
- User display name and role shown when logged in
- Moderator console link only visible to moderators
- Guest access for read-only browsing

### ✅ Persistent Sessions
- User session stored in localStorage
- Stays logged in across page refreshes
- Automatic redirect on logout

## How It Works

### 1. AuthContext (`src/context/AuthContext.tsx`)
Provides authentication state throughout the app:
```typescript
const { user, login, logout, isAuthenticated, isModerator } = useAuth();
```

### 2. AuthService (`src/services/authService.ts`)
Handles login/logout logic:
- Validates credentials against mock user database
- Stores user in localStorage
- Provides role checking methods

### 3. ProtectedRoute (`src/components/auth/ProtectedRoute.tsx`)
Wrapper component that:
- Redirects to login if not authenticated
- Checks user role for protected pages
- Redirects to dashboard if insufficient permissions

### 4. Login Page (`src/pages/Login.tsx`)
- Manual login form
- Quick demo account buttons
- Guest access option

## Usage Examples

### Protecting a Route
```typescript
<Route
  path="/moderator"
  element={
    <ProtectedRoute requiredRole="moderator">
      <ModeratorConsole />
    </ProtectedRoute>
  }
/>
```

### Checking Auth in Components
```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isModerator } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.displayName}!</p>}
      {isModerator && <button>Moderator Action</button>}
    </div>
  );
}
```

### Manual Login/Logout
```typescript
const { login, logout } = useAuth();

// Login
const success = login('moderator', 'mod123');
if (success) {
  // Redirect or update UI
}

// Logout
logout();
navigate('/login');
```

## Adding New Users

Edit `src/types/auth.ts`:

```typescript
export const MOCK_USERS = [
  // ...existing users
  {
    id: '4',
    username: 'newuser',
    password: 'pass123',
    role: 'reader', // or 'moderator'
    displayName: 'New User',
  },
];
```

## Security Notes

⚠️ **This is a MOCK authentication system for demo/development purposes:**

- Passwords stored in plain text in frontend code
- No backend validation
- Can be bypassed by editing localStorage
- Not suitable for production use

**For production**, you would need:
- Real backend authentication (JWT, OAuth2, etc.)
- Password hashing
- Secure token storage
- Session management
- HTTPS

## Testing the System

1. **As Guest**:
   - Visit any page without logging in
   - Try to access `/moderator` → redirected to login

2. **As Reader**:
   - Login with `reader` / `reader123`
   - Can browse articles, submit, report
   - Cannot access moderator console
   - Try `/moderator` → redirected to dashboard

3. **As Moderator**:
   - Login with `moderator` / `mod123`
   - Full access to all pages
   - Can see moderator console link in header
   - Can override FIRE scores

## Implementation Details

### localStorage Structure
```json
{
  "fire_auth_user": {
    "id": "2",
    "username": "moderator",
    "role": "moderator",
    "displayName": "Demo Moderator"
  }
}
```

### Role Hierarchy
- `reader` - Basic user permissions
- `moderator` - Enhanced permissions + moderator console access

### Auto-redirect Logic
- Not authenticated + trying to access protected route → Login page
- Not authorized for role + trying to access protected route → Dashboard
- After login → Original destination or dashboard
- After logout → Login page

---

**Perfect for university project demos - shows understanding of auth concepts without over-engineering! 🔐**
