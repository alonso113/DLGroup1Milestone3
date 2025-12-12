import React from 'react';
import { FIREScore } from '../../types';

interface FIREBadgeProps {
  fireScore?: FIREScore;
  size?: 'small' | 'medium' | 'large';
}

export const FIREBadge: React.FC<FIREBadgeProps> = ({ fireScore, size = 'medium' }) => {
  if (!fireScore) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-300 text-gray-700 text-sm">
        <span>⚪ No Score Available</span>
      </div>
    );
  }

  const getBadgeColor = (score: number): string => {
    if (score < 35) return 'bg-fire-red text-white';
    if (score < 50) return 'bg-fire-yellow text-gray-900';
    return 'bg-fire-green text-white';
  };

  const getBadgeIcon = (category: string): string => {
    switch (category) {
      case 'Likely misleading':
        return '⚠️';
      case 'Unverified':
        return '⚡';
      case 'No risk detected':
        return '✓';
      default:
        return '?';
    }
  };

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  };

  return (
    <div className="inline-block">
      <div
        className={`inline-flex items-center gap-2 rounded-full font-semibold ${getBadgeColor(
          fireScore.score
        )} ${sizeClasses[size]}`}
        title={`FIRE Score: ${fireScore.score.toFixed(1)}/100 | Confidence: ${(fireScore.confidence * 100).toFixed(1)}%`}
      >
        <span>{getBadgeIcon(fireScore.category)}</span>
        <span>FIRE: {fireScore.score.toFixed(0)}</span>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {fireScore.category} • {(fireScore.confidence * 100).toFixed(0)}% confidence
      </div>
    </div>
  );
};
