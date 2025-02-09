
import { useState, useCallback, useRef } from 'react';
import { TimerMetrics } from '@/types/metrics';
import { toast } from "sonner";

export const useTimerState = (initialDuration: number) => {
  const validInitialDuration = Math.max(60, initialDuration);
  const [timeLeft, setTimeLeft] = useState<number>(validInitialDuration);
  const [minutes, setMinutesState] = useState(Math.floor(validInitialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<TimerMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    expectedTime: validInitialDuration,
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

  const updateTimeLeft = useCallback((newTimeLeft: number | ((prev: number) => number)) => {
    if (!isMountedRef.current) return;
    if (typeof newTimeLeft === 'function') {
      setTimeLeft(prev => newTimeLeft(prev));
    } else {
      setTimeLeft(newTimeLeft);
    }
  }, []);

  const updateMinutes = useCallback((newMinutes: number) => {
    if (!isMountedRef.current) return;
    setMinutesState(newMinutes);
  }, []);

  const updateIsRunning = useCallback((running: boolean) => {
    if (!isMountedRef.current) return;
    setIsRunning(running);
  }, []);

  const updateMetrics = useCallback((updates: Partial<TimerMetrics> | ((prev: TimerMetrics) => Partial<TimerMetrics>)) => {
    if (!isMountedRef.current) return;
    setMetrics(prev => {
      const newUpdates = typeof updates === 'function' ? updates(prev) : updates;
      return { ...prev, ...newUpdates };
    });
  }, []);

  return {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    updateTimeLeft,
    updateMinutes,
    updateIsRunning,
    updateMetrics,
    isMountedRef,
  };
};
