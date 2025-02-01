import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { TimerMetrics } from '../types/timer';

interface UseTimerStateProps {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

export const useTimerState = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerStateProps) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
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

  // Enhanced logging for duration updates
  useEffect(() => {
    console.log('Timer State - Initial duration changed:', initialDuration);
    console.log('Timer State - Current state:', {
      timeLeft,
      minutes,
      isRunning,
      metrics,
    });

    if (!isRunning && initialDuration > 0) {
      console.log('Timer State - Updating time left and minutes');
      setTimeLeft(initialDuration);
      setMinutesState(Math.floor(initialDuration / 60));
    }
  }, [initialDuration, isRunning]);

  const setMinutes = useCallback((newMinutes: number) => {
    console.log('Timer State - Setting minutes to:', newMinutes);
    setMinutesState(newMinutes);
    setTimeLeft(newMinutes * 60);
    onDurationChange?.(newMinutes);
  }, [onDurationChange]);

  const start = useCallback(() => {
    console.log('Timer State - Starting timer');
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
    console.log('Timer State - Pausing timer');
    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      pauseCount: prev.pauseCount + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    console.log('Timer State - Resetting timer');
    setIsRunning(false);
    setTimeLeft(minutes * 60);
    setMetrics({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      originalDuration: minutes * 60,
      actualDuration: 0,
      favoriteQuotes: 0,
    });
  }, [minutes]);

  const addTime = useCallback((additionalMinutes: number) => {
    console.log('Timer State - Adding minutes:', additionalMinutes);
    setTimeLeft(prev => prev + (additionalMinutes * 60));
    toast(`Added ${additionalMinutes} minutes. Keep going! 💪`);
  }, []);

  const completeTimer = useCallback(() => {
    console.log('Timer State - Completing timer');
    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      endTime: new Date(),
      actualDuration: prev.startTime 
        ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
        : prev.actualDuration,
    }));
  }, []);

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

    return () => {
      if (interval) {
        console.log('Timer State - Cleaning up interval');
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onTimeUp, completeTimer]);

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