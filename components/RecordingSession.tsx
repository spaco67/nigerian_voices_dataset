"use client";

import { useState, useEffect } from "react";
import { VoiceRecorder } from "./VoiceRecorder";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "./ui/progress";
import { languages } from "@/lib/languages";
import { CelebrationModal } from "./CelebrationModal";
import { TranslatedPhrase, PhraseCategory } from "@/lib/types";

interface Phrase extends TranslatedPhrase {
  category: PhraseCategory;
}

interface RecordingSessionProps {
  languageId: string;
  onComplete?: () => void;
}

export function RecordingSession({
  languageId,
  onComplete,
}: RecordingSessionProps) {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recordings, setRecordings] = useState<
    { phrase: Phrase; audioUrl: string }[]
  >([]);
  const { toast } = useToast();
  const language = languages.find((l) => l.id === languageId);
  const [showCelebration, setShowCelebration] = useState(false);
  const [totalRecordings, setTotalRecordings] = useState(0);

  useEffect(() => {
    loadPhrases();
  }, []);

  async function loadPhrases() {
    try {
      setIsLoading(true);
      console.log(`Loading phrases for ${language?.name}...`);

      const response = await fetch(
        `/api/phrases/generate?languageId=${languageId}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to load phrases");
      }

      const data = await response.json();
      console.log(`Loaded ${data.length} phrases for ${language?.name}`);
      setPhrases(data);
    } catch (error) {
      console.error("Error loading phrases:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load phrases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRecordingComplete(audioUrl: string) {
    const newRecording = {
      phrase: phrases[currentIndex],
      audioUrl,
    };

    setRecordings([...recordings, newRecording]);
    const newTotal = totalRecordings + 1;
    setTotalRecordings(newTotal);

    // Show celebration every 5 recordings
    if (newTotal > 0 && newTotal % 5 === 0) {
      setShowCelebration(true);
    }

    // If this was the last phrase, save all recordings
    if (currentIndex === phrases.length - 1) {
      await saveAllRecordings();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  async function saveAllRecordings() {
    try {
      setIsLoading(true);
      console.log("Preparing recordings for save:", {
        languageId,
        recordings: recordings.map((rec) => ({
          englishPhrase: rec.phrase.english,
          translatedPhrase: rec.phrase.translated,
          audioUrl: rec.audioUrl,
        })),
      });

      const response = await fetch("/api/recordings/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId,
          recordings: recordings.map((rec) => ({
            englishPhrase: rec.phrase.english,
            translatedPhrase: rec.phrase.translated,
            audioUrl: rec.audioUrl,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Save response error:", error);
        throw new Error(error.error || "Failed to save recordings");
      }

      const data = await response.json();
      console.log("Save response:", data);

      if (!data.success) {
        throw new Error("Failed to save recordings");
      }

      toast({
        title: "Success",
        description: `All recordings have been saved successfully! You earned ${data.points} points.`,
      });

      onComplete?.();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save recordings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Preparing phrases...</p>
        </div>
      </Card>
    );
  }

  if (phrases.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p>No phrases available. Please try again.</p>
        <Button onClick={loadPhrases} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        recordingsCount={totalRecordings}
      />
      <Card className="p-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{language?.name}</h2>
              <p className="text-muted-foreground">
                Recording {currentIndex + 1} of {phrases.length}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPhrases}
              disabled={isLoading}
            >
              Generate New Phrases
            </Button>
          </div>

          <Progress
            value={(currentIndex / phrases.length) * 100}
            className="h-2"
          />

          <div className="max-w-2xl mx-auto w-full">
            <VoiceRecorder
              phrase={phrases[currentIndex]}
              onRecordingComplete={handleRecordingComplete}
              onSkip={() =>
                setCurrentIndex(Math.min(currentIndex + 1, phrases.length - 1))
              }
              onPrevious={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentIndex(Math.min(currentIndex + 1, phrases.length - 1))
              }
              disabled={currentIndex === phrases.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
