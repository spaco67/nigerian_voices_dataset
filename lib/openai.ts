import { TranslatedPhrase, PhraseCategory } from './types';

// Temporary mock data for development
const mockPhrases: Record<PhraseCategory, TranslatedPhrase[]> = {
  general_conversation: [
    {
      english: "Good morning, how are you?",
      translated: "Sannu da safe, yaya kake?",
      category: "general_conversation",
      context: "Morning greeting"
    }
  ],
  healthcare: [
    {
      english: "Are you feeling better today?",
      translated: "Kana jin sauƙi yau?",
      category: "healthcare",
      context: "Checking on patient's health"
    }
  ],
  agriculture: [
    {
      english: "The crops need water",
      translated: "Gonakin suna buƙatar ruwa",
      category: "agriculture",
      context: "Farming activities"
    }
  ],
  business: [
    {
      english: "How much does this cost?",
      translated: "Nawa ne wannan?",
      category: "business",
      context: "Price inquiry"
    }
  ],
  education: [
    {
      english: "What did you learn today?",
      translated: "Me ka koya yau?",
      category: "education",
      context: "Learning progress"
    }
  ],
  technology: [
    {
      english: "Can you help me with my phone?",
      translated: "Za ka iya taimaka min da wayata?",
      category: "technology",
      context: "Technical assistance"
    }
  ],
  culture: [
    {
      english: "This is our traditional dance",
      translated: "Wannan shine rawar gargajiyarmu",
      category: "culture",
      context: "Cultural activities"
    }
  ],
  entertainment: [
    {
      english: "What's your favorite song?",
      translated: "Wane waƙa kake so?",
      category: "entertainment",
      context: "Music preferences"
    }
  ]
};

const SYSTEM_PROMPT = `You are a helpful assistant that generates natural, conversational phrases in both English and their translations. 
Focus on creating practical, everyday phrases that would be useful for language learning and AI training.`;

export async function generatePhrases(
  language: string,
  category: PhraseCategory,
  count: number = 1
): Promise<TranslatedPhrase[]> {
  // For development, return mock data
  return mockPhrases[category] || [];
}