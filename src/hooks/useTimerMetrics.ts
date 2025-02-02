import { useState, useCallback } from 'react';
import { TimerMetrics } from '../types/metrics';

export const useTimerMetrics = (initialDuration: number) => {
  const [metrics, setMetrics] = useState<TimerMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    originalDuration: initialDuration,
    actualDuration: 0,
    favoriteQuotes: 0,
  });

  const startTimer = useCallback(() => {
    console.log('Timer Metrics - Starting timer');
    setMetrics(prev => ({
      ...prev,
      startTime: prev.startTime || new Date(),
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    console.log('Timer Metrics - Pausing timer');
    setMetrics(prev => ({
      ...prev,
      pauseCount: prev.pauseCount + 1,
    }));
  }, []);

  const completeTimer = useCallback(() => {
    console.log('Timer Metrics - Completing timer');
    setMetrics(prev => ({
      ...prev,
      endTime: new Date(),
      actualDuration: prev.startTime 
        ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
        : prev.actualDuration,
    }));
  }, []);

  const resetMetrics = useCallback((newDuration: number) => {
    console.log('Timer Metrics - Resetting metrics with duration:', newDuration);
    setMetrics({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      originalDuration: newDuration,
      actualDuration: 0,
      favoriteQuotes: 0,
    });
  }, []);

  return {
    metrics,
    startTimer,
    pauseTimer,
    completeTimer,
    resetMetrics,
  };
};
