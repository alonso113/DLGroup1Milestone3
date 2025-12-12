import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ArticlePage } from './pages/ArticlePage';
import { ModeratorConsole } from './pages/ModeratorConsole';
import { SubmitArticle } from './pages/SubmitArticle';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/moderator" element={<ModeratorConsole />} />
        <Route path="/submit" element={<SubmitArticle />} />
      </Routes>
    </Router>
  );
}

export default App;
