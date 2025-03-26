'use client';

import { useQuery } from '@tanstack/react-query';

interface AnalyticsData {
  totalRecordings: number;
  totalPoints: number;
  recentRecordings: Array<{
    _id: string;
    englishPhrase: string;
    translatedPhrase: string;
    languageId: string;
    createdAt: string;
    audioUrl: string;
  }>;
  languageContributions: Array<{
    languageId: string;
    name: string;
    count: number;
    totalWords: number;
  }>;
  activityTimeline: Array<{
    date: string;
    count: number;
  }>;
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/user/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
} 