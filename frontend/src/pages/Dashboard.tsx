import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { ArticleCard } from '../components/common/ArticleCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Article } from '../types';
import { articleService } from '../services/articleService';

export const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getArticles();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News Feed</h1>
            <p className="text-gray-600 mt-2">
              Latest news articles with FIRE risk assessment
            </p>
          </div>
          <button
            onClick={loadArticles}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading && <LoadingSpinner message="Loading articles..." />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found.</p>
            <p className="text-gray-500 mt-2">Check back later for news updates.</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="space-y-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
