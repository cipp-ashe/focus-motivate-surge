
import { useState, useRef } from 'react';
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

  const updateTimeLeft = (value: number | ((prev: number) => number)) => {
    if (isMountedRef.current) {
      setTimeLeft(value);
    }
  };

  const updateMinutes = (value: number) => {
    if (isMountedRef.current) {
      setMinutes(value);
    }
  };

  const updateMetrics = (updates: Partial<TimerStateMetrics>) => {
    if (isMountedRef.current) {
      setMetrics(prev => ({
        ...prev,
        ...updates
      }));
    }
  };

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
