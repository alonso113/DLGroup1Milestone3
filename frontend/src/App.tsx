import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { ArticlePage } from './pages/ArticlePage';
import { ModeratorConsole } from './pages/ModeratorConsole';
import { SubmitArticle } from './pages/SubmitArticle';
import { Login } from './pages/Login';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/submit" element={<SubmitArticle />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/mod"
            element={
              <ProtectedRoute>
                <ModeratorConsole />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
