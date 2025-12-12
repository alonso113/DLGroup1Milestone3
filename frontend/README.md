# FIRE News Aggregator - Frontend

React + TypeScript frontend for the FIRE News Aggregator platform.

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8080/api/v1
```

## Features

- **News Feed**: Browse articles with FIRE scores
- **Article Detail**: Read full articles and report incorrect scores
- **Moderator Console**: Review and override FIRE predictions
- **Submit Article**: Test the FIRE scoring system with new articles

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
