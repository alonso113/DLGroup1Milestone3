# Frontend Setup Guide

## Prerequisites

Before setting up the frontend, you need to install Node.js and npm.

### Install Node.js

1. Download Node.js from https://nodejs.org/
2. Choose the LTS (Long Term Support) version (v18 or v20)
3. Run the installer and follow the prompts
4. Restart your terminal after installation

### Verify Installation

Open PowerShell and run:

```powershell
node --version
npm --version
```

You should see version numbers (e.g., v18.17.0 and 9.6.7).

## Setup Steps

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

This will install all packages defined in `package.json`:
- React & React DOM
- React Router
- Axios
- Tailwind CSS
- TypeScript
- Vite
- And all their dependencies

### 2. Configure Environment

Copy the example environment file:

```powershell
copy .env.example .env
```

Edit `.env` if needed to point to your backend API.

### 3. Start Development Server

```powershell
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```powershell
npm run build
```

The built files will be in the `dist` directory.

## Development Commands

```powershell
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already taken, Vite will automatically use the next available port (3001, 3002, etc.).

### Module Not Found Errors

If you see errors about missing modules after pulling new code:

```powershell
npm install
```

### Clear Cache

If you have persistent issues:

```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### TypeScript Errors

The TypeScript errors you see in the editor are expected until you run `npm install`. This installs the type definitions for React and other libraries.

## Next Steps

Once the frontend is running:

1. ✅ Frontend is complete and ready
2. ⏳ Create the Go backend
3. ⏳ Integrate with your ML model
4. ⏳ Connect everything with Docker Compose

## Notes

- The frontend is configured to proxy API requests to `http://localhost:8080/api/v1`
- CORS is handled by the backend, but a proxy is configured in Vite for development
- All API calls go through the services layer (`src/services/`)
- TypeScript provides type safety for the entire application
