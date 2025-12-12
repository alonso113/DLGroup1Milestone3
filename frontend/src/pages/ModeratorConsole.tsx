import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ModeratorQueueItem } from '../types';
import { moderatorService } from '../services/moderatorService';
import { Link } from 'react-router-dom';

export const ModeratorConsole: React.FC = () => {
  const [queue, setQueue] = useState<ModeratorQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [overrideLabel, setOverrideLabel] = useState<'fake' | 'real'>('real');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const data = await moderatorService.getQueue();
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
        notes,
      });
      alert('Override saved successfully!');
      setSelectedArticle(null);
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
    if (score < 35) return 'text-fire-red';
    if (score < 50) return 'text-fire-yellow';
    return 'text-fire-green';
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
                    Headline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FIRE Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/article/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {item.headline}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.source}</td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                        {item.score.toFixed(0)}
                      </span>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.report_count > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.report_count} {item.report_count === 1 ? 'report' : 'reports'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedArticle(item.id)}
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
