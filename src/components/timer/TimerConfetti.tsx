
import { memo } from "react";

interface TimerConfettiProps {
  show: boolean;
  width: number;
  height: number;
}

// Removed all confetti decorations
export const TimerConfetti = memo(({ show, width, height }: TimerConfettiProps) => {
  // Returns nothing - confetti removed
  return null;
});

TimerConfetti.displayName = 'TimerConfetti';
