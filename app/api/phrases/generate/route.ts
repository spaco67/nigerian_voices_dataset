import { NextResponse } from 'next/server';
import { generatePhrases } from '@/lib/services/openai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const phrases = await generatePhrases(languageId);
    return NextResponse.json(phrases);
  } catch (error) {
    console.error('Phrase generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate phrases' },
      { status: 500 }
    );
  }
} 