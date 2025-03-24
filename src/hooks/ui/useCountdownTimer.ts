
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
    if (!isRunning && !isPaused) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    } else if (isPaused) {
      // Resume from pause
      pausedTimeRef.current += Date.now() - (startTimeRef.current || Date.now());
      startTimeRef.current = Date.now();
      setIsPaused(false);
      setIsRunning(true);
    }
  }, [isRunning, isPaused]);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsPaused(true);
      setIsRunning(false);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    clearTimer();
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [initialTime, clearTimer]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - interval / 1000;
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
