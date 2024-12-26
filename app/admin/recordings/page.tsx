'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceRecording } from '@/lib/types';
import { Check, X, Loader2 } from 'lucide-react';

export default function AdminRecordingsPage() {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const response = await fetch('/api/admin/recordings');
      if (response.ok) {
        const data = await response.json();
        setRecordings(data);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (recordingId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/recordings/${recordingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchRecordings();
      }
    } catch (error) {
      console.error('Error updating recording status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Review Voice Recordings</h1>
      
      <div className="grid gap-6">
        {recordings.map((recording) => (
          <Card key={recording.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-medium">{recording.englishPhrase}</p>
                <p className="text-lg">{recording.translatedPhrase}</p>
                <audio controls src={recording.audioUrl} className="mt-2" />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateStatus(recording.id, 'approved')}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateStatus(recording.id, 'rejected')}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {recordings.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No pending recordings to review</p>
          </Card>
        )}
      </div>
    </div>
  );
}