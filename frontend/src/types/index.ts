// Type definitions for the FIRE News Aggregator

export interface Article {
  id?: string;
  title: string;
  content: string;
  author?: string;
  source: string;
  url?: string;
  publishedAt?: Date;
  fire_score?: FIREScore;
}

export interface FIREScore {
  score: number; // 0-100 (the overall FIRE score)
  label: 'fake' | 'real';
  confidence: number; // 0.0-1.0
  category: 'Likely misleading' | 'Unverified' | 'No risk detected';
  timestamp?: Date;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  author?: string;
  source: string;
  url?: string;
  publishedAt: string;
}

export interface ReportRequest {
  article_id: string;
  reason: string;
}

export interface ModeratorOverrideRequest {
  article_id: string;
  new_label: 'fake' | 'real';
  confidence: number;
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
