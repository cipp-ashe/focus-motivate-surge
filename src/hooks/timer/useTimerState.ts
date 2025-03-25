
import { useState, useRef } from 'react';
import { TimerStateMetrics } from '@/types/metrics';

interface UseTimerStateParams {
  initialDuration?: number;
}

export const useTimerState = (initialDuration = 1500) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [minutes, setMinutes] = useState(Math.floor(initialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);
  const isMountedRef = useRef(true);
  
  // Initialize metrics
  const [metrics, setMetrics] = useState<TimerStateMetrics>({
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

  // Update timeLeft
  const updateTimeLeft = (newTimeLeft: number) => {
    setTimeLeft(newTimeLeft);
  };

  // Update minutes
  const updateMinutes = (newMinutes: number) => {
    setMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
  };

  // Update metrics
  const updateMetrics = (updates: Partial<TimerStateMetrics>) => {
    setMetrics(prev => ({ ...prev, ...updates }));
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
    isMountedRef
  };
};
