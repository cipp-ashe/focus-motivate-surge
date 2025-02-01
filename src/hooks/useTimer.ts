import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { TimerMetrics } from '../types/timer';

interface UseTimerOptions {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerMetrics;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => void;
}

export const useTimer = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerOptions): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [minutes, setMinutesState] = useState(Math.floor(initialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<TimerMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    originalDuration: initialDuration,
    actualDuration: 0,
    favoriteQuotes: 0,
  });

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
            completeTimer();
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
    if (!metrics.startTime) {
      setMetrics(prev => ({
        ...prev,
        startTime: new Date(),
      }));
    }
    toast("Timer started! You've got this! 🚀");
  }, [metrics.startTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      pauseCount: prev.pauseCount + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
    setMetrics({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      originalDuration: minutes * 60,
      actualDuration: 0,
    });
  }, [minutes]);

  const addTime = useCallback((additionalMinutes: number) => {
    setTimeLeft((prev) => prev + (additionalMinutes * 60));
    toast(`Added ${additionalMinutes} minutes. Keep the momentum going! 💪`);
  }, []);

  const completeTimer = useCallback(() => {
    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      endTime: new Date(),
      actualDuration: prev.startTime 
        ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
        : prev.actualDuration,
    }));
  }, []);

  return {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start,
    pause,
    reset,
    addTime,
    setMinutes,
    completeTimer,
  };
};
