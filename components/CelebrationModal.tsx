'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Confetti from 'react-confetti';
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/use-window-size";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordingsCount: number;
}

export function CelebrationModal({ isOpen, onClose, recordingsCount }: CelebrationModalProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-4">
            <h3 className="text-2xl font-bold">Amazing Contribution! 🎉</h3>
            <p className="text-muted-foreground">
              You've donated {recordingsCount} voices to help preserve Nigerian languages.
              Your contributions make a real difference!
            </p>
            <Button onClick={onClose} className="mt-4">
              Continue Contributing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 