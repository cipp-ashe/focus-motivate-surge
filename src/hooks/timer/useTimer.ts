
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
    setIsRunning,
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
    setIsRunning,
    updateMetrics,
    onDurationChange,
  });

  // Handle duration changes and initialization
  useEffect(() => {
    if (!isMountedRef.current) return;

    const validDuration = Math.max(60, initialDuration);
    
    if (timeLeft !== validDuration) {
      console.log('Timer - Initial duration changed:', {
        initialDuration,
        validDuration,
        currentTimeLeft: timeLeft,
        currentMinutes: minutes
      });
      
      updateTimeLeft(validDuration);
      updateMinutes(Math.floor(validDuration / 60));
      
      // Only initialize metrics if they haven't been set yet
      if (!metrics.startTime) {
        updateMetrics({
          expectedTime: validDuration,
          startTime: null,
          endTime: null,
          pauseCount: 0,
          actualDuration: 0,
          favoriteQuotes: 0,
          pausedTime: 0,
          lastPauseTimestamp: null,
          extensionTime: 0,
          netEffectiveTime: 0,
          efficiencyRatio: 0,
          completionStatus: 'Completed On Time',
          isPaused: false,
          pausedTimeLeft: null
        });
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      setIsRunning(false);
    };
  }, [initialDuration, updateTimeLeft, updateMinutes, updateMetrics, setIsRunning, isMountedRef, timeLeft, minutes, metrics.startTime]);

  // Handle timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      console.log('Timer - Starting countdown:', {
        timeLeft,
        minutes,
        isRunning
      });
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;

        updateTimeLeft((time) => {
          if (time <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = undefined;
            }
            completeTimer();
            onTimeUp?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isRunning, timeLeft, onTimeUp, completeTimer, updateTimeLeft, isMountedRef, minutes]);

  // Cleanup on unmount
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
    updateMetrics,
    start,
    pause,
    reset,
    addTime,
    setMinutes,
    completeTimer,
  };
};
