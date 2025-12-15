import { api } from './api';
import { Article, ModeratorOverrideRequest } from '../types';

export const moderatorService = {
  // Get moderation queue (articles reported by users)
  async getQueue(): Promise<Article[]> {
    const response = await api.get<Article[]>('/moderator/queue');
    return response.data;
  },

  // Override FIRE score
  async overrideFIREScore(override: ModeratorOverrideRequest): Promise<void> {
    await api.post('/moderator/override', override);
  },
};
