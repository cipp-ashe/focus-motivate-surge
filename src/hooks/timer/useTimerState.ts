
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
    completionStatus: 'Completed On Time'
  });

  const isMountedRef = useRef(true);

  const updateTimeLeft = useCallback((newTimeLeft: number) => {
    if (!isMountedRef.current) return;
    setTimeLeft(newTimeLeft);
  }, []);

  const updateMinutes = useCallback((newMinutes: number) => {
    if (!isMountedRef.current) return;
    setMinutesState(newMinutes);
  }, []);

  const updateIsRunning = useCallback((running: boolean) => {
    if (!isMountedRef.current) return;
    setIsRunning(running);
  }, []);

  const updateMetrics = useCallback((updates: Partial<TimerMetrics>) => {
    if (!isMountedRef.current) return;
    setMetrics(prev => ({ ...prev, ...updates }));
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
