import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { FIREBadge } from './FIREBadge';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Link to={`/article/${article.id}`}>
            <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2">
              {article.headline}
            </h2>
          </Link>
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            <span className="font-medium">{article.source}</span>
            <span>•</span>
            <span>{article.author || 'Unknown Author'}</span>
            <span>•</span>
            <span>{formatDate(article.published_date)}</span>
          </div>
        </div>
        <div className="ml-4">
          <FIREBadge fireScore={article.fire_score} size="medium" />
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">
        {article.body.substring(0, 200)}...
      </p>
      
      <Link 
        to={`/article/${article.id}`}
        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
      >
        Read Full Article
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};
