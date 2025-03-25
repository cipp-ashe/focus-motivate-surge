
import { useCallback } from 'react';
import { TimerStateMetrics } from '@/types/metrics';

export interface TimerActionProps {
  timeLeft: number;
  metrics: TimerStateMetrics;
  updateTimeLeft: (timeLeft: number) => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setIsRunning: (isRunning: boolean) => void;
}

export const useTimerActions = ({
  timeLeft,
  metrics,
  updateTimeLeft,
  updateMetrics,
  setIsRunning
}: TimerActionProps) => {
  // Start timer
  const startTimer = useCallback(() => {
    const now = new Date();
    
    updateMetrics({
      startTime: metrics.startTime || now.toISOString(),
      isPaused: false
    });
    
    setIsRunning(true);
  }, [metrics.startTime, setIsRunning, updateMetrics]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    updateMetrics({
      isPaused: true
    });
    
    setIsRunning(false);
  }, [setIsRunning, updateMetrics]);

  // Extend timer
  const extendTimer = useCallback((minutes: number) => {
    const extensionSeconds = minutes * 60;
    
    updateTimeLeft(timeLeft + extensionSeconds);
    
    updateMetrics({
      extensionTime: metrics.extensionTime + extensionSeconds
    });
  }, [timeLeft, metrics.extensionTime, updateTimeLeft, updateMetrics]);

  // Reset timer
  const resetTimer = useCallback(async () => {
    setIsRunning(false);
    
    updateMetrics({
      startTime: '',
      endTime: null,
      completionDate: null,
      actualDuration: 0,
      pausedTime: 0,
      extensionTime: 0,
      netEffectiveTime: 0,
      completionStatus: null,
      isPaused: false
    });
    
    return Promise.resolve();
  }, [setIsRunning, updateMetrics]);

  // Complete timer
  const completeTimer = useCallback(async () => {
    const now = new Date();
    
    updateMetrics({
      endTime: now.toISOString(),
      completionDate: now.toISOString(),
      completionStatus: 'completed'
    });
    
    setIsRunning(false);
    
    return Promise.resolve();
  }, [setIsRunning, updateMetrics]);

  // Update metrics
  const updateMetricsAction = useCallback((updates: Partial<TimerStateMetrics>) => {
    updateMetrics(updates);
  }, [updateMetrics]);

  return {
    startTimer,
    pauseTimer,
    extendTimer,
    resetTimer,
    completeTimer,
    updateMetrics: updateMetricsAction
  };
};
