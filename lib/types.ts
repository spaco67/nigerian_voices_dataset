export type Language = {
  id: string;
  name: string;
  code: string;
  flag: string;
  region: string;
};

export type VoiceRecording = {
  id: string;
  userId: string;
  languageId: string;
  englishPhrase: string;
  translatedPhrase: string;
  audioUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
};

export type CustomRecording = {
  id: string;
  userId: string;
  languageId: string;
  englishPhrase: string;
  translatedPhrase: string;
  context?: string;
  audioUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  hashedPassword: string;
  name: string;
  role: 'user' | 'admin';
  points: number;
  createdAt: Date;
};

export type Phrase = {
  id: string;
  englishText: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  context: string;
};

export type PhraseCategory = 
  | 'general_conversation'
  | 'healthcare'
  | 'agriculture'
  | 'business'
  | 'education'
  | 'technology'
  | 'culture'
  | 'entertainment';

export type TranslatedPhrase = {
  english: string;
  translated: string;
  category: PhraseCategory;
  context?: string;
};