'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, SkipForward, ChevronLeft, Loader2, Play, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { TranslatedPhrase } from '@/lib/types';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

interface VoiceRecorderProps {
  phrase: TranslatedPhrase;
  onRecordingComplete: (audioUrl: string) => Promise<void>;
  onSkip?: () => void;
  onPrevious?: () => void;
}

export function VoiceRecorder({
  phrase,
  onRecordingComplete,
  onSkip,
  onPrevious,
}: VoiceRecorderProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    isRecording,
    isUploading,
    startRecording,
    stopRecording,
    audioBlob,
    resetRecording,
  } = useAudioRecorder({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  const handlePlayPreview = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    try {
      setIsProcessing(true);
      const cloudinaryUrl = await uploadToCloudinary(audioBlob);
      await onRecordingComplete(cloudinaryUrl);
      
      toast({
        title: "Success",
        description: "Recording saved successfully",
      });

      // Reset the recorder
      resetRecording();
      setAudioPreviewUrl(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save recording",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = isRecording || isUploading || isProcessing;

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <p className="text-lg font-medium">{phrase.english}</p>
        <p className="text-2xl">{phrase.translated}</p>
        {phrase.context && (
          <p className="text-sm text-muted-foreground">{phrase.context}</p>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {onPrevious && (
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={isDisabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {audioPreviewUrl ? (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={handlePlayPreview}
              disabled={isProcessing}
            >
              {isPlaying ? (
                <Square className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetRecording}
              disabled={isProcessing}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                'Submit'
              )}
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="recording-button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading || isProcessing}
          >
            {isRecording ? (
              <Square className="h-6 w-6" />
            ) : isUploading || isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        )}

        {onSkip && (
          <Button
            variant="outline"
            size="icon"
            onClick={onSkip}
            disabled={isDisabled}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        )}
      </div>

      {(isRecording || isUploading || isProcessing) && (
        <p className="text-center text-sm text-muted-foreground">
          {isRecording ? "Recording..." : isUploading ? "Uploading..." : "Processing..."}
        </p>
      )}

      {audioPreviewUrl && (
        <audio
          ref={audioRef}
          src={audioPreviewUrl}
          onEnded={handleAudioEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </Card>
  );
}