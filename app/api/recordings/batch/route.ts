import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { languageId, recordings } = await request.json();

    // Create all recordings in a transaction
    const savedRecordings = await db.$transaction(
      recordings.map((rec: any) => 
        db.recording.create({
          data: {
            userId: session.user.id,
            languageId,
            englishPhrase: rec.englishPhrase,
            translatedPhrase: rec.translatedPhrase,
            audioUrl: rec.audioUrl,
            context: rec.context,
            status: 'pending',
          },
        })
      )
    );

    return NextResponse.json({ success: true, recordings: savedRecordings });
  } catch (error) {
    console.error('Batch recording error:', error);
    return NextResponse.json(
      { error: 'Failed to save recordings' },
      { status: 500 }
    );
  }
} 