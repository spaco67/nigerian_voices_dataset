import OpenAI from 'openai';
import { Language } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedPhrase {
  english: string;
  translated: string;
  context?: string;
}

export async function generatePhrases(
  language: Language,
  count: number = 5
): Promise<GeneratedPhrase[]> {
  const prompt = `Generate ${count} everyday phrases in English that need to be translated to ${language.name} (${language.nativeName}), a Nigerian language. 
  Consider the following context:
  - Language: ${language.name}
  - Region: ${language.region || 'Nigeria'}
  - Cultural Context: Nigerian daily life and customs
  
  For each phrase:
  1. Keep it simple and conversational
  2. Make it culturally relevant to ${language.name} speakers
  3. Include context where helpful
  4. Provide both English and ${language.name} translations
  
  Format as JSON array with properties: 
  - english (the English phrase)
  - translated (the ${language.name} translation)
  - context (optional cultural or usage context)
  
  Ensure the translations are accurate and culturally appropriate.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    const phrases: GeneratedPhrase[] = JSON.parse(response);
    return phrases;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate phrases');
  }
} 