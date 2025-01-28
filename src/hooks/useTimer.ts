import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UseTimerOptions {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
}

export const useTimer = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerOptions): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [minutes, setMinutesState] = useState(Math.floor(initialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);

  // Sync timeLeft with minutes changes
  const setMinutes = useCallback((newMinutes: number) => {
    setMinutesState(newMinutes);
    setTimeLeft(newMinutes * 60);
    onDurationChange?.(newMinutes);
  }, [onDurationChange]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const start = useCallback(() => {
    setIsRunning(true);
    toast("Timer started! You've got this! 🚀");
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  }, [minutes]);

  const addTime = useCallback((additionalMinutes: number) => {
    setTimeLeft((prev) => prev + (additionalMinutes * 60));
    toast(`Added ${additionalMinutes} minutes. Keep the momentum going! 💪`);
  }, []);

  return {
    timeLeft,
    minutes,
    isRunning,
    start,
    pause,
    reset,
    addTime,
    setMinutes,
  };
};