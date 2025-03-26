export interface RecordingData {
  englishPhrase: string;
  translatedPhrase: string;
  audioUrl: string;
  languageId: string;
  userId: string;
  status: string;
  validations: number;
  positiveValidations: number;
  duration: number;
  sampleRate: number;
  category: string;
  metadata: {
    device: string;
    isGuest: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
} 