import { api } from './api';
import { ModeratorQueueItem, ModeratorOverrideRequest } from '../types';

export const moderatorService = {
  // Get moderation queue
  async getQueue(): Promise<ModeratorQueueItem[]> {
    const response = await api.get<{ queue: ModeratorQueueItem[] }>('/moderator/queue');
    return response.data.queue || [];
  },

  // Override FIRE score
  async overrideFIREScore(override: ModeratorOverrideRequest): Promise<void> {
    await api.post('/moderator/override', override);
  },
};
