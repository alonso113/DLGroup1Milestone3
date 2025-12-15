import { api } from './api';
import { Article, CreateArticleRequest, ReportRequest } from '../types';

export const articleService = {
  // Get all articles with FIRE scores
  async getArticles(): Promise<Article[]> {
    const response = await api.get<Article[]>('/articles');
    return response.data;
  },

  // Get single article by ID
  async getArticleById(id: string): Promise<Article> {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },

  // Submit a new article (for partner API)
  async submitArticle(article: CreateArticleRequest): Promise<{ article_id: string; fire_score: any }> {
    const response = await api.post('/partner/submit', article);
    return response.data;
  },

  // Report an article
  async reportArticle(articleId: string, reason: string): Promise<void> {
    await api.post(`/articles/${articleId}/report`, { reason });
  },
};
