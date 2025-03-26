import { NextResponse } from 'next/server';
import { generatePhrases } from '@/lib/services/openai';
import { languages } from '@/lib/languages';

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

    const language = languages.find(l => l.id === languageId);
    if (!language) {
      return NextResponse.json(
        { error: 'Invalid language ID' },
        { status: 400 }
      );
    }

    console.log(`Generating phrases for language: ${language.name}`);
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