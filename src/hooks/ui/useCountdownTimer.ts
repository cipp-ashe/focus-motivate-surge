
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountdownTimerOptions {
  initialTime: number;
  interval?: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export const useCountdownTimer = ({
  initialTime,
  interval = 1000,
  autoStart = false,
  onComplete
}: UseCountdownTimerOptions) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    console.log('Starting timer with timeLeft:', timeLeft);
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isRunning, timeLeft]);

  const pause = useCallback(() => {
    console.log('Pausing timer with timeLeft:', timeLeft);
    if (isRunning) {
      setIsPaused(true);
      setIsRunning(false);
      // Store the amount of time paused for later resuming
      if (startTimeRef.current) {
        pausedTimeRef.current += Date.now() - startTimeRef.current;
      }
    }
  }, [isRunning, timeLeft]);

  const reset = useCallback(() => {
    console.log('Resetting timer to:', initialTime);
    clearTimer();
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [initialTime, clearTimer]);

  useEffect(() => {
    if (isRunning) {
      console.log('Timer running, setting interval');
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - interval / 1000;
          console.log('Timer tick, new time:', newTime);
          if (newTime <= 0) {
            clearTimer();
            setIsRunning(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return newTime;
        });
      }, interval);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, interval, onComplete, clearTimer]);

  // Update timeLeft when initialTime changes
  useEffect(() => {
    // Only reset the time if we're not running
    if (!isRunning && !isPaused) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, isRunning, isPaused]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    reset,
    getElapsedTime: () => (startTimeRef.current ? Date.now() - startTimeRef.current - pausedTimeRef.current : 0)
  };
};
