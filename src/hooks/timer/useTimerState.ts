
import { useState, useRef, useCallback } from 'react';
import { TimerStateMetrics } from '@/types/metrics';

export const useTimerState = (initialDuration: number) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [minutes, setMinutes] = useState(Math.floor(initialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<TimerStateMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    expectedTime: initialDuration,
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

  const isMountedRef = useRef(true);
  const lastTimeLeftRef = useRef(initialDuration);
  const lastPauseStartRef = useRef<Date | null>(null);

  const updateTimeLeft = useCallback((value: number | ((prev: number) => number)) => {
    if (isMountedRef.current) {
      if (typeof value === 'function') {
        setTimeLeft((prev) => {
          const newValue = value(prev);
          console.log('Updating time left:', { prev, newValue });
          lastTimeLeftRef.current = newValue;
          return newValue;
        });
      } else {
        // Only update if not paused or if explicitly setting a new value
        if (!metrics.isPaused || value !== lastTimeLeftRef.current) {
          console.log('Setting time left directly:', value);
          lastTimeLeftRef.current = value;
          setTimeLeft(value);
        } else {
          console.log('Maintaining paused time:', metrics.pausedTimeLeft);
          setTimeLeft(metrics.pausedTimeLeft || value);
        }
      }
    }
  }, [metrics.isPaused, metrics.pausedTimeLeft]);

  const updateMinutes = useCallback((value: number) => {
    if (isMountedRef.current) {
      setMinutes(value);
    }
  }, []);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics> | ((prev: TimerStateMetrics) => Partial<TimerStateMetrics>)) => {
    if (isMountedRef.current) {
      setMetrics(prev => {
        const newUpdates = typeof updates === 'function' ? updates(prev) : updates;
        const newMetrics = {
          ...prev,
          ...newUpdates
        };
        
        // If pausing, store the current timeLeft and pause start time
        if (newUpdates.isPaused && !prev.isPaused) {
          newMetrics.pausedTimeLeft = timeLeft;
          lastPauseStartRef.current = new Date();
        }
        
        // If resuming, calculate and add pause duration to total paused time
        if (!newUpdates.isPaused && prev.isPaused && lastPauseStartRef.current) {
          const pauseDuration = Math.floor(
            (new Date().getTime() - lastPauseStartRef.current.getTime()) / 1000
          );
          newMetrics.pausedTime = (prev.pausedTime || 0) + pauseDuration;
          lastPauseStartRef.current = null;
        }
        
        // If resuming, use the stored pausedTimeLeft
        if (!newUpdates.isPaused && prev.isPaused && prev.pausedTimeLeft !== null) {
          lastTimeLeftRef.current = prev.pausedTimeLeft;
        }
        
        return newMetrics;
      });
    }
  }, [timeLeft]);

  return {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    isMountedRef,
  };
};
