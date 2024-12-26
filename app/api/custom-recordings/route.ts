import { NextResponse } from 'next/server';
import { createCustomRecording } from '@/lib/db/models/custom-recording.model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { language, english, translated, context, audioUrl } = body;

    // TODO: Get actual user ID from session
    const userId = 'temp-user-id';

    const recording = await createCustomRecording({
      userId,
      languageId: language,
      englishPhrase: english,
      translatedPhrase: translated,
      context,
      audioUrl,
      status: 'pending',
    });

    return NextResponse.json(recording);
  } catch (error) {
    console.error('Error creating custom recording:', error);
    return NextResponse.json(
      { error: 'Failed to create recording' },
      { status: 500 }
    );
  }
}