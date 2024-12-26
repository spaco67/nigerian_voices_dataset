import { ObjectId } from 'mongodb';

export interface BaseDocument {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recording extends BaseDocument {
  userId: string;
  languageId: string;
  englishPhrase: string;
  translatedPhrase: string;
  audioUrl: string;
  duration: number;
  sampleRate: number;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  metadata: {
    device?: string;
    browser?: string;
    quality?: number;
    background_noise?: number;
  };
  validations: number;
  positiveValidations: number;
}

export interface CustomRecording extends Recording {
  context: string;
  dialect?: string;
  tags: string[];
}

export interface Validation extends BaseDocument {
  recordingId: string;
  userId: string;
  isPositive: boolean;
  criteria: {
    clarity: number;
    accuracy: number;
    pronunciation: number;
    background_noise: number;
  };
  notes?: string;
}

export interface Language extends BaseDocument {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  dialects: string[];
  contributors: number;
  recordingsCount: number;
  validatedCount: number;
}

export interface UserProfile extends BaseDocument {
  userId: string;
  nativeLanguages: string[];
  spokenLanguages: string[];
  age?: number;
  gender?: string;
  region?: string;
  dialect?: string;
  contributions: {
    recordings: number;
    validations: number;
    points: number;
  };
  badges: {
    name: string;
    earnedAt: Date;
  }[];
}

export interface Dataset extends BaseDocument {
  languageId: string;
  version: string;
  recordingsCount: number;
  totalDuration: number;
  format: string;
  quality: {
    averageValidationScore: number;
    validationsPerRecording: number;
  };
  metadata: {
    speakers: number;
    maleToFemaleRatio?: number;
    ageDistribution?: Record<string, number>;
    dialectDistribution?: Record<string, number>;
    regionDistribution?: Record<string, number>;
  };
  downloadUrl: string;
  license: string;
} 