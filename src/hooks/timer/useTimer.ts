
import { useEffect, useRef } from 'react';
import { UseTimerOptions, UseTimerReturn } from './types';
import { useTimerState } from './useTimerState';
import { useTimerActions } from './useTimerActions';

export const useTimer = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerOptions): UseTimerReturn => {
  const {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    updateTimeLeft,
    updateMinutes,
    updateIsRunning,
    updateMetrics,
    isMountedRef,
  } = useTimerState(initialDuration);

  const intervalRef = useRef<NodeJS.Timeout>();

  const {
    setMinutes,
    start,
    pause,
    reset,
    addTime,
    completeTimer,
  } = useTimerActions({
    timeLeft,
    minutes,
    updateTimeLeft,
    updateMinutes,
    updateIsRunning,
    updateMetrics,
    onDurationChange,
  });

  useEffect(() => {
    if (!isMountedRef.current) return;

    const validDuration = Math.max(60, initialDuration);
    updateTimeLeft(validDuration);
    updateMinutes(Math.floor(validDuration / 60));
    updateMetrics({
      expectedTime: validDuration
    });

    return () => {
      updateIsRunning(false);
    };
  }, [initialDuration, updateTimeLeft, updateMinutes, updateMetrics, updateIsRunning, isMountedRef]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;

        updateTimeLeft((time) => {
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isRunning, timeLeft, onTimeUp, completeTimer, updateTimeLeft, isMountedRef]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
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
