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
  const [pausedTimeLeft, setPausedTimeLeft] = useState<number | null>(null);
  
  const {
    metrics,
    startTimer,
    pauseTimer,
    completeTimer,
    resetMetrics
  } = useTimerMetrics(initialDuration);

  // Reset timer when initial duration changes and timer is not running
  useEffect(() => {
    console.log('Timer State - Initial duration changed:', initialDuration);
    if (!isRunning && initialDuration > 0) {
      console.log('Timer State - Updating time left and minutes');
      setTimeLeft(initialDuration);
      setMinutesState(Math.floor(initialDuration / 60));
      resetMetrics(initialDuration);
      setPausedTimeLeft(null);
    }
  }, [initialDuration, isRunning, resetMetrics]);

  const setMinutes = useCallback((newMinutes: number) => {
    console.log('Timer State - Setting minutes to:', newMinutes);
    setMinutesState(newMinutes);
    setTimeLeft(newMinutes * 60);
    onDurationChange?.(newMinutes);
    setPausedTimeLeft(null);
  }, [onDurationChange]);

  const start = useCallback(() => {
    console.log('Timer State - Starting timer');
    setIsRunning(true);
    startTimer();
    
    // If resuming from pause, use the paused time
    if (pausedTimeLeft !== null) {
      setTimeLeft(pausedTimeLeft);
      toast("Timer resumed! Keep going! 💪");
    } else {
      toast("Timer started! You've got this! 🚀");
    }
  }, [startTimer, pausedTimeLeft]);

  const pause = useCallback(() => {
    console.log('Timer State - Pausing timer');
    setIsRunning(false);
    setPausedTimeLeft(timeLeft);
    pauseTimer();
    toast("Timer paused! Take a breather 😌");
  }, [pauseTimer, timeLeft]);

  const reset = useCallback(() => {
    console.log('Timer State - Resetting timer');
    setIsRunning(false);
    setTimeLeft(minutes * 60);
    resetMetrics(minutes * 60);
    setPausedTimeLeft(null);
  }, [minutes, resetMetrics]);

  const addTime = useCallback((additionalMinutes: number) => {
    console.log('Timer State - Adding minutes:', additionalMinutes);
    const newTime = timeLeft + (additionalMinutes * 60);
    setTimeLeft(newTime);
    if (pausedTimeLeft !== null) {
      setPausedTimeLeft(newTime);
    }
    toast(`Added ${additionalMinutes} minutes. Keep going! 💪`);
  }, [timeLeft]);

  // Timer countdown effect
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