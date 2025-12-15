import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
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

          <nav className="flex gap-6 items-center">
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
            
            {/* Only show moderator link if authenticated */}
            {user && (
              <Link
                to="/mod"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive('/mod')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Moderator Console
              </Link>
            )}
            
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

            <Link
              to="/model-card"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive('/model-card')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Model Card
            </Link>

            <Link
              to="/data-card"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive('/data-card')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Data Card
            </Link>

            {/* Show logout button if authenticated */}
            {user && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
