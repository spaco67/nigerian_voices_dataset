'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languages } from '@/lib/languages';
import { TranslatedPhrase } from '@/lib/types';

export default function CustomContributePage() {
  const [phrase, setPhrase] = useState<TranslatedPhrase | null>(null);
  const [formData, setFormData] = useState({
    english: '',
    translated: '',
    context: '',
    language: '',
    category: 'custom',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhrase({
      english: formData.english,
      translated: formData.translated,
      category: 'custom',
      context: formData.context,
    });
  };

  const handleRecordingComplete = async (audioUrl: string) => {
    try {
      const response = await fetch('/api/custom-recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          audioUrl,
        }),
      });

      if (response.ok) {
        setPhrase(null);
        setFormData({
          english: '',
          translated: '',
          context: '',
          language: '',
          category: 'custom',
        });
      }
    } catch (error) {
      console.error('Error saving recording:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Contribute Custom Phrases
        </h1>

        {!phrase ? (
          <Card className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">English Phrase</label>
                <Input
                  value={formData.english}
                  onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                  placeholder="Enter the English phrase"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Translated Phrase</label>
                <Input
                  value={formData.translated}
                  onChange={(e) => setFormData({ ...formData, translated: e.target.value })}
                  placeholder="Enter the translated phrase"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Context or Meaning (Optional)</label>
                <Textarea
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Provide context or explain the meaning"
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.english || !formData.translated || !formData.language}
              >
                Start Recording
              </Button>
            </form>
          </Card>
        ) : (
          <VoiceRecorder
            phrase={phrase}
            onRecordingComplete={handleRecordingComplete}
            onSkip={() => setPhrase(null)}
            onPrevious={() => setPhrase(null)}
          />
        )}
      </div>
    </div>
  );
}