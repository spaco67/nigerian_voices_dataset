"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceRecording } from "@/lib/types";
import { Check, X, Loader2, Volume2, AlertCircle, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function AdminRecordingsPage() {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchRecordings();
  }, []);

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  const fetchRecordings = async () => {
    try {
      const response = await fetch("/api/admin/recordings");
      if (response.ok) {
        const data = await response.json();
        setRecordings(data);
      }
    } catch (error) {
      console.error("Error fetching recordings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recordings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (recordingId: string, isValid: boolean) => {
    try {
      const response = await fetch(
        `/api/admin/recordings/${recordingId}/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isValid }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `Recording ${
            isValid ? "validated" : "rejected"
          } successfully`,
        });
        fetchRecordings();
      }
    } catch (error) {
      console.error("Error validating recording:", error);
      toast({
        title: "Error",
        description: "Failed to validate recording",
        variant: "destructive",
      });
    }
  };

  const handlePlayAudio = (recordingId: string) => {
    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== recordingId) {
      const currentAudio = audioRefs.current[currentlyPlaying];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    // Get the recording's audio URL
    const recording = recordings.find((r) => r.id === recordingId);
    if (!recording) return;

    // Create a new audio element for this recording
    const audio = new Audio(recording.audioUrl);
    audioRefs.current[recordingId] = audio;

    // Set up event listeners
    audio.onended = () => handleAudioEnded(recordingId);

    // Play the audio
    audio.play();
    setCurrentlyPlaying(recordingId);
  };

  const handleAudioEnded = (recordingId: string) => {
    setCurrentlyPlaying(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Review Voice Recordings
          </h1>
          <p className="text-muted-foreground">
            Help validate the quality and accuracy of voice recordings
          </p>
        </div>

        <div className="grid gap-6">
          {recordings.map((recording) => (
            <Card key={recording.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{recording.englishPhrase}</p>
                    <p className="text-lg">{recording.translatedPhrase}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleValidation(recording.id, true)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleValidation(recording.id, false)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlayAudio(recording.id)}
                    className="flex items-center gap-2"
                  >
                    {currentlyPlaying === recording.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    {currentlyPlaying === recording.id ? "Pause" : "Listen"}
                  </Button>
                  <audio
                    ref={(el) => (audioRefs.current[recording.id] = el)}
                    src={recording.audioUrl}
                    className="hidden"
                    onEnded={() => handleAudioEnded(recording.id)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Validation Progress</span>
                    <span>{recording.validations} / 3 reviews</span>
                  </div>
                  <Progress
                    value={(recording.validations / 3) * 100}
                    className="h-2"
                  />
                </div>

                {recording.validations > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {recording.positiveValidations} positive,{" "}
                      {recording.validations - recording.positiveValidations}{" "}
                      negative validations
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {recordings.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No recordings to review</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
