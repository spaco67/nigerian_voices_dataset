'use client';

import { RecordingSession } from '@/components/RecordingSession';
import { useRouter } from 'next/navigation';

export default function ContributePage({ params }: { params: { languageId: string } }) {
  const router = useRouter();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Contribute Recordings</h1>
      <RecordingSession
        languageId={params.languageId}
        onComplete={() => router.push('/dashboard')}
      />
    </div>
  );
}