import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { FIREBadge } from '../components/common/FIREBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Article } from '../types';
import { articleService } from '../services/articleService';

export const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true);
      const data = await articleService.getArticleById(articleId);
      setArticle(data);
    } catch (err) {
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: Date): string => {
    if (!date) return 'Unknown Date';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleReport = async () => {
    if (!article || !reportReason.trim() || !article.id) return;

    try {
      setReportSubmitting(true);
      await articleService.reportArticle(article.id, reportReason);
      alert('Report submitted successfully! Moderators will review it.');
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      alert('Failed to submit report. Please try again.');
      console.error('Error submitting report:', err);
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading article..." />
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Feed
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Feed
        </button>

        <article className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-gray-600">
                <p className="font-medium text-lg">{article.source}</p>
                <p className="text-sm">By {article.author || 'Unknown Author'}</p>
                <p className="text-sm">{formatDate(article.publishedAt)}</p>
              </div>
              
              <div>
                <FIREBadge fireScore={article.fire_score} size="large" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{article.content}</p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6 flex gap-4">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              🚩 Report Incorrect FIRE Score
            </button>
          </div>
        </article>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Report Incorrect Score</h3>
              <p className="text-gray-600 mb-4">
                Please explain why you believe the FIRE score for this article is incorrect:
              </p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 mb-4 h-32"
                placeholder="E.g., This article is from a reputable source and should have a higher score..."
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReport}
                  disabled={!reportReason.trim() || reportSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
