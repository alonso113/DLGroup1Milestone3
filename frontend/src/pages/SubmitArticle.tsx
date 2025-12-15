import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { articleService } from '../services/articleService';

export const SubmitArticle: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    source: '',
    url: '',
    publishedAt: new Date().toISOString().split('T')[0], // Default to today
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.source) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await articleService.submitArticle(formData);
      setResult(response);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        author: '',
        source: '',
        url: '',
        publishedAt: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError('Failed to submit article. Please try again.');
      console.error('Error submitting article:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getFIREScoreColor = (score: number): string => {
    // Higher score = safer (green), Lower score = riskier (red)
    if (score >= 50) return 'text-fire-green';  // Safe/reliable
    if (score >= 35) return 'text-fire-yellow'; // Unverified
    return 'text-fire-red';                      // Likely misleading
  };
  // revisit which fields are here, prob dont need all the ones actually here
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Submit Article</h1>
          <p className="text-gray-600 mt-2">
            Submit a news article to get a FIRE risk assessment
          </p>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">✅ Article Submitted Successfully!</h3>
            <div className="space-y-2">
              <p className="text-sm text-green-800">
                <span className="font-medium">Article ID:</span> {result.article_id}
              </p>
              <div className="border-t border-green-200 pt-3 mt-3">
                <p className="font-medium text-green-900 mb-2">FIRE Score Results:</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Score:</span>
                    <span className={`ml-2 text-2xl font-bold ${getFIREScoreColor(result.fire_score.score)}`}>
                      {result.fire_score.score.toFixed(0)}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Label:</span>
                    <span className="ml-2 font-semibold">{result.fire_score.label}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Confidence:</span>
                    <span className="ml-2 font-semibold">
                      {(result.fire_score.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Category:</span>
                    <span className="ml-2 font-semibold">{result.fire_score.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Article Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the full article text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Author name"
              />
            </div>

            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                Source <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., New York Times"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Article URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/article"
              />
            </div>

            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
                Published Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="publishedAt"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Article & Get FIRE Score'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  content: '',
                  author: '',
                  source: '',
                  url: '',
                  publishedAt: new Date().toISOString().split('T')[0],
                });
                setResult(null);
                setError(null);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
