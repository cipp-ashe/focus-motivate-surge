import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useTimerMetrics } from './useTimerMetrics';

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
  const [lastPausedTime, setLastPausedTime] = useState<number | null>(null);
  
  const {
    metrics,
    startTimer,
    pauseTimer,
    completeTimer,
    resetMetrics
  } = useTimerMetrics(initialDuration);

  useEffect(() => {
    console.log('Timer State - Initial duration changed:', initialDuration);
    if (!isRunning && initialDuration > 0) {
      console.log('Timer State - Updating time left and minutes');
      setTimeLeft(initialDuration);
      setMinutesState(Math.floor(initialDuration / 60));
      resetMetrics(initialDuration);
      setLastPausedTime(null);
    }
  }, [initialDuration, isRunning, resetMetrics]);

  const setMinutes = useCallback((newMinutes: number) => {
    console.log('Timer State - Setting minutes to:', newMinutes);
    setMinutesState(newMinutes);
    setTimeLeft(newMinutes * 60);
    onDurationChange?.(newMinutes);
    setLastPausedTime(null);
  }, [onDurationChange]);

  const start = useCallback(() => {
    console.log('Timer State - Starting timer');
    setIsRunning(true);
    startTimer();
    if (lastPausedTime === null) {
      toast("Timer started! You've got this! 🚀");
    } else {
      toast("Timer resumed! Keep going! 💪");
    }
  }, [startTimer, lastPausedTime]);

  const pause = useCallback(() => {
    console.log('Timer State - Pausing timer');
    setIsRunning(false);
    setLastPausedTime(timeLeft);
    pauseTimer();
    toast("Timer paused! Take a breather 😌");
  }, [pauseTimer, timeLeft]);

  const reset = useCallback(() => {
    console.log('Timer State - Resetting timer');
    setIsRunning(false);
    setTimeLeft(minutes * 60);
    resetMetrics(minutes * 60);
    setLastPausedTime(null);
  }, [minutes, resetMetrics]);

  const addTime = useCallback((additionalMinutes: number) => {
    console.log('Timer State - Adding minutes:', additionalMinutes);
    setTimeLeft(prev => prev + (additionalMinutes * 60));
    toast(`Added ${additionalMinutes} minutes. Keep going! 💪`);
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