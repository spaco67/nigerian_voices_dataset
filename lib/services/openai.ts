import OpenAI from 'openai';
import { languages } from '@/lib/languages';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedPhrase {
  english: string;
  translated: string;
  context?: string;
}

export async function generatePhrases(
  languageId: string,
  count: number = 5
): Promise<GeneratedPhrase[]> {
  const language = languages.find(l => l.id === languageId);
  
  if (!language) {
    throw new Error('Language not found');
  }

  const systemPrompt = `You are a native ${language.name} language expert. Generate ${count} everyday phrases in both English and ${language.name}. Return them in a valid JSON array format.`;
  
  const userPrompt = `Generate ${count} common phrases used in ${language.region || 'Nigeria'}.

Format each phrase as a JSON object with:
- english: The English phrase
- translated: The ${language.name} translation
- context: Brief usage context

Return them in this exact format:
{
  "phrases": [
    {
      "english": "Good morning",
      "translated": "[${language.name} translation]",
      "context": "Used in the morning until noon"
    }
    // ... more phrases
  ]
}`;

  try {
    console.log(`Generating phrases for ${language.name}...`);
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    try {
      const parsed = JSON.parse(response);
      
      // Handle both array and object with phrases property
      const phrases = Array.isArray(parsed) ? parsed : parsed.phrases;

      if (!Array.isArray(phrases)) {
        console.error('Invalid response structure:', parsed);
        throw new Error('Invalid response format');
      }

      // Validate each phrase
      const validPhrases = phrases.filter(phrase => 
        phrase &&
        typeof phrase === 'object' &&
        typeof phrase.english === 'string' &&
        typeof phrase.translated === 'string' &&
        phrase.english.trim() !== '' &&
        phrase.translated.trim() !== ''
      );

      if (validPhrases.length === 0) {
        console.error('No valid phrases in response:', phrases);
        throw new Error('No valid phrases generated');
      }

      console.log(`Successfully generated ${validPhrases.length} phrases for ${language.name}`);
      return validPhrases.slice(0, count);

    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Raw response:', response);
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate phrases');
  }
} 