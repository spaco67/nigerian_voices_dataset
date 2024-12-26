import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createRecording } from '@/lib/db/models/recording.model';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { languageId, englishPhrase, translatedPhrase, audioUrl, category } = body;

    if (!languageId || !englishPhrase || !translatedPhrase || !audioUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recording = await createRecording({
      userId: session?.user?.id || 'guest',
      languageId,
      englishPhrase,
      translatedPhrase,
      audioUrl,
      category: category || 'general',
      status: 'pending',
      duration: 0,
      sampleRate: 44100,
      metadata: {
        device: request.headers.get('user-agent') || undefined,
        isGuest: !session?.user,
      },
      validations: 0,
      positiveValidations: 0,
    });

    return NextResponse.json(recording);
  } catch (error) {
    console.error('Error creating recording:', error);
    return NextResponse.json(
      { error: 'Failed to create recording' },
      { status: 500 }
    );
  }
}