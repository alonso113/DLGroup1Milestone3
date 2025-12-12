import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FIRE News</h1>
              <p className="text-xs text-gray-600">Fake Information Risk Evaluation</p>
            </div>
          </Link>

          <nav className="flex gap-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              News Feed
            </Link>
            <Link
              to="/moderator"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive('/moderator')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Moderator Console
            </Link>
            <Link
              to="/submit"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive('/submit')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Submit Article
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
