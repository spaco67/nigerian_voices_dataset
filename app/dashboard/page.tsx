'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Recording, Validation } from '@/lib/types/schema';
import { useEffect, useState } from 'react';
import { Loader2, Mic, CheckCircle2, XCircle, User } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [validations, setValidations] = useState<Validation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [recordingsRes, validationsRes] = await Promise.all([
          fetch('/api/user/recordings'),
          fetch('/api/user/validations')
        ]);

        if (recordingsRes.ok && validationsRes.ok) {
          const recordingsData = await recordingsRes.json();
          const validationsData = await validationsRes.json();

          setRecordings(Array.isArray(recordingsData) ? recordingsData : []);
          setValidations(Array.isArray(validationsData) ? validationsData : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <p>Please sign in to view your dashboard.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const approvedCount = recordings.filter(r => r.status === 'approved').length;
  const rejectedCount = recordings.filter(r => r.status === 'rejected').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {session.user.name}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recordings.length}</p>
                <p className="text-sm text-muted-foreground">Total Recordings</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved Recordings</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected Recordings</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="recordings">
            <TabsList className="w-full max-w-md grid grid-cols-2">
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
              <TabsTrigger value="validations">Validations</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="recordings" className="space-y-4">
                {recordings.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p>No recordings yet.</p>
                  </Card>
                ) : (
                  recordings.map((recording) => (
                    <Card key={recording._id?.toString()} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{recording.englishPhrase}</p>
                          <p className="text-sm text-muted-foreground">
                            {recording.translatedPhrase}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm capitalize">{recording.status}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(recording.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
              <TabsContent value="validations" className="space-y-4">
                {validations.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p>No validations yet.</p>
                  </Card>
                ) : (
                  validations.map((validation) => (
                    <Card key={validation._id?.toString()} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {validation.isPositive ? 'Approved' : 'Rejected'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Average Score: {
                              (Object.values(validation.criteria).reduce((a, b) => a + b, 0) / 
                              Object.values(validation.criteria).length).toFixed(1)
                            }
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(validation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
} 