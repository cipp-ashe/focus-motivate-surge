import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseTimerControlsProps {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

export const useTimerControls = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerControlsProps) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, initialDuration));
  const [minutes, setMinutesState] = useState(Math.floor(Math.max(0, initialDuration) / 60));
  const [isRunning, setIsRunning] = useState(false);

  const setMinutes = useCallback((newMinutes: number) => {
    setMinutesState(newMinutes);
    setTimeLeft(newMinutes * 60);
    onDurationChange?.(newMinutes);
  }, [onDurationChange]);

  const start = useCallback(() => {
    setIsRunning(true);
    toast(isRunning ? "Timer resumed! Keep going! 💪" : "Timer started! You've got this! 🚀");
  }, [isRunning]);

  const pause = useCallback(() => {
    setIsRunning(false);
    toast("Timer paused! Take a breather 😌");
  }, []);

  const addTime = useCallback((additionalMinutes: number) => {
    if (additionalMinutes <= 0) {
      console.warn('Invalid addTime value:', additionalMinutes);
      return;
    }

    const additionalSeconds = additionalMinutes * 60;
    setTimeLeft(prev => Math.max(0, prev + additionalSeconds));
    setMinutesState(prev => Math.ceil((prev * 60 + additionalSeconds) / 60));
    
    toast(`Added ${additionalMinutes} minutes. Keep going! 💪`);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
    console.debug('Timer reset');
  }, [minutes]);

  const decrementTime = useCallback(() => {
    setTimeLeft(prev => {
      const newTimeLeft = prev - 1;
      // Show confirmation at 1 second left instead of 0
      if (newTimeLeft <= 1) {
        onTimeUp?.();
        return 1;
      }
      return newTimeLeft;
    });
  }, [onTimeUp]);

  return {
    timeLeft,
    minutes,
    isRunning,
    setMinutes,
    start,
    pause,
    addTime,
    reset,
    decrementTime,
  };
};