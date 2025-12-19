import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Article } from '../types';
import { moderatorService } from '../services/moderatorService';
import { Link } from 'react-router-dom';

export const ModeratorConsole: React.FC = () => {
  const [queue, setQueue] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [overrideLabel, setOverrideLabel] = useState<'fake' | 'real'>('real');
  const [confidence, setConfidence] = useState<number>(0.8);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const data = await moderatorService.getQueue();
      console.log('Moderation queue:', data);
      setQueue(data);
    } catch (err) {
      console.error('Error loading queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!selectedArticle) return;

    try {
      setSubmitting(true);
      await moderatorService.overrideFIREScore({
        article_id: selectedArticle,
        new_label: overrideLabel,
        confidence: confidence,
        notes,
      });
      alert('Override saved successfully!');
      setSelectedArticle(null);
      setConfidence(0.8);
      setNotes('');
      loadQueue();
    } catch (err) {
      alert('Failed to save override. Please try again.');
      console.error('Error saving override:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score < 35) return 'text-red-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Layout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Moderator Console</h1>
          <p className="text-gray-600 mt-2">
            Review and override FIRE scores for flagged articles
          </p>
        </div>

        {loading && <LoadingSpinner message="Loading moderation queue..." />}

        {!loading && queue.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">✅ No articles in moderation queue!</p>
            <p className="text-gray-500 mt-2">All clear for now.</p>
          </div>
        )}

        {!loading && queue.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FIRE Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queue.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/article/${article.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{article.source}</td>
                    <td className="px-6 py-4">
                      {article.fire_score && (
                        <>
                          <span className={`text-lg font-bold ${getScoreColor(article.fire_score.score)}`}>
                            {article.fire_score.score}
                          </span>
                          <div className="text-xs text-gray-500">{article.fire_score.category}</div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedArticle(article.id || '')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Override
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Override Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Override FIRE Score</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Label
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="real"
                      checked={overrideLabel === 'real'}
                      onChange={(e) => setOverrideLabel(e.target.value as 'real')}
                      className="mr-2"
                    />
                    <span>Real News</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="fake"
                      checked={overrideLabel === 'fake'}
                      onChange={(e) => setOverrideLabel(e.target.value as 'fake')}
                      className="mr-2"
                    />
                    <span>Fake News</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={confidence}
                  onChange={(e) => setConfidence(parseFloat(e.target.value) || 0.8)}
                  className="w-full border border-gray-300 rounded-md p-3"
                  placeholder="0.8"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher confidence = stronger conviction in your assessment
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 h-24"
                  placeholder="Add any notes about this override decision..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleOverride}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {submitting ? 'Saving...' : 'Save Override'}
                </button>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    setNotes('');
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
