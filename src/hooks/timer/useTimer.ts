
import { useEffect, useRef, useCallback } from 'react';
import { UseTimerOptions } from './types';
import { useTimerState } from './useTimerState';
import { useTimerActions } from './useTimerActions';

export const useTimer = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerOptions) => {
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

  const actions = useTimerActions({
    timeLeft,
    minutes,
    taskName: '',
    metrics,
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    onDurationChange,
  });

  const { 
    setMinutes, 
    start, 
    pause, 
    reset, 
    addTime, 
    completeTimer 
  } = actions;

  // Handle duration changes and initialization
  useEffect(() => {
    if (!isMountedRef.current) return;

    const validDuration = Math.max(60, initialDuration);
    
    // Only update if not running and not paused, and time has actually changed
    if (!isRunning && !metrics.isPaused && timeLeft !== validDuration) {
      console.log('Timer - Initial duration changed:', {
        initialDuration,
        validDuration,
        currentTimeLeft: timeLeft,
        currentMinutes: minutes
      });
      
      updateTimeLeft(validDuration);
      updateMinutes(Math.floor(validDuration / 60));
      
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
  }, [initialDuration, updateTimeLeft, updateMinutes, updateMetrics, timeLeft, minutes, metrics.startTime, isRunning, metrics.isPaused]);

  // Handle timer countdown
  useEffect(() => {
    // Don't start if not running or time is up
    if (!isRunning || timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    console.log('Timer - Starting countdown:', {
      timeLeft,
      minutes,
      isRunning
    });
    
    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        clearInterval(intervalRef.current);
        return;
      }

      updateTimeLeft((currentTime) => {
        const newTime = currentTime - 1;
        console.log('Timer tick:', { currentTime, newTime });
        
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          completeTimer();
          onTimeUp?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // Cleanup interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isRunning, timeLeft, onTimeUp, completeTimer, updateTimeLeft, setIsRunning, isMountedRef, minutes]);

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
