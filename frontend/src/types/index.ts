// Type definitions for the FIRE News Aggregator

export interface Article {
  id: string;
  headline: string;
  body: string;
  author: string;
  source: string;
  published_date: string;
  created_at: string;
  fire_score?: FIREScore;
}

export interface FIREScore {
  id: string;
  article_id: string;
  score: number; // 0-100
  label: 'fake' | 'real';
  confidence: number; // 0.0-1.0
  category: 'Likely misleading' | 'Unverified' | 'No risk detected';
  created_at: string;
}

export interface CreateArticleRequest {
  headline: string;
  body: string;
  author?: string;
  source: string;
  published_date?: string;
}

export interface ReportRequest {
  article_id: string;
  reason: string;
}

export interface ModeratorOverrideRequest {
  article_id: string;
  new_label: 'fake' | 'real';
  notes?: string;
}

export interface ModeratorQueueItem {
  id: string;
  headline: string;
  source: string;
  score: number;
  category: string;
  report_count: number;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
}
