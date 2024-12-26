'use client';

import { useState, useEffect } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language } from '@/lib/types';
import { generatePhrases } from '@/lib/openai';
import { TranslatedPhrase, PhraseCategory } from '@/lib/types';
import { Loader2, RefreshCw } from 'lucide-react';

const categories: { value: PhraseCategory; label: string }[] = [
  { value: 'general_conversation', label: 'General Conversation' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'culture', label: 'Culture' },
  { value: 'entertainment', label: 'Entertainment' },
];

export default function ContributeClient({ language }: { language: Language }) {
  const [currentPhrase, setCurrentPhrase] = useState<TranslatedPhrase | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<PhraseCategory>('general_conversation');
  const [phraseHistory, setPhraseHistory] = useState<TranslatedPhrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchNewPhrase = async () => {
    setLoading(true);
    try {
      const phrases = await generatePhrases(language.name, category, 1);
      if (phrases.length > 0) {
        const newPhrase = phrases[0];
        setCurrentPhrase(newPhrase);
        setPhraseHistory(prev => [...prev.slice(0, currentIndex + 1), newPhrase]);
        setCurrentIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching phrase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewPhrase();
  }, [category, language]);

  const handleRecordingComplete = async (audioUrl: string) => {
    if (!currentPhrase) return;

    try {
      const response = await fetch('/api/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languageId: language.id,
          englishPhrase: currentPhrase.english,
          translatedPhrase: currentPhrase.translated,
          audioUrl,
          category: currentPhrase.category,
        }),
      });

      if (response.ok) {
        fetchNewPhrase();
      }
    } catch (error) {
      console.error('Error saving recording:', error);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCurrentPhrase(phraseHistory[currentIndex - 1]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 glass-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            {language.flag} Contributing to {language.name}
          </h1>
          <p className="text-muted-foreground">
            Record your voice to help preserve and digitize {language.name}
          </p>
        </div>

        <div className="mt-8">
          {loading ? (
            <Card className="p-8 flex items-center justify-center card-hover-effect backdrop-blur-lg">
              <Loader2 className="w-8 h-8 animate-spin" />
            </Card>
          ) : currentPhrase ? (
            <div className="space-y-4">
              <VoiceRecorder
                phrase={currentPhrase}
                onSkip={fetchNewPhrase}
                onPrevious={handlePrevious}
                onRecordingComplete={handleRecordingComplete}
              />
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p>Failed to load phrase. Please try again.</p>
              <Button onClick={fetchNewPhrase} className="mt-4">
                Retry
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}