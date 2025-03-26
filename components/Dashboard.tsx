'use client';

import { useAnalytics } from '@/hooks/use-analytics';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Recordings</h3>
          <p className="text-2xl font-bold">{analytics?.totalRecordings || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Points</h3>
          <p className="text-2xl font-bold">{analytics?.totalPoints || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Languages Contributed</h3>
          <p className="text-2xl font-bold">{analytics?.languageContributions.length || 0}</p>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recording Activity</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.activityTimeline}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Language Contributions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Language Contributions</h3>
        <div className="space-y-4">
          {analytics?.languageContributions.map((lang) => (
            <div key={lang.languageId} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{lang.name}</p>
                <p className="text-sm text-muted-foreground">
                  {lang.totalWords} words recorded
                </p>
              </div>
              <p className="text-lg font-semibold">{lang.count} recordings</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Recordings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Recordings</h3>
        <div className="space-y-4">
          {analytics?.recentRecordings.map((recording) => (
            <div key={recording._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{recording.englishPhrase}</p>
                <p className="text-sm text-muted-foreground">
                  {recording.translatedPhrase}
                </p>
              </div>
              <audio src={recording.audioUrl} controls className="h-8" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 