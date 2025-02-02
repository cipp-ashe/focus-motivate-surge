import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { TimerMetrics } from '../types/metrics';

interface UseTimerOptions {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerMetrics;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => void;
}

export const useTimer = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerOptions): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [minutes, setMinutesState] = useState(Math.floor(initialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<TimerMetrics>({
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
    completionStatus: 'Completed On Time'
  });

  // Handle duration updates
  useEffect(() => {
    console.log('Initial duration changed:', initialDuration);
    if (initialDuration > 0) {
      setTimeLeft(initialDuration);
      setMinutesState(Math.floor(initialDuration / 60));
    }
  }, [initialDuration]);

  const setMinutes = useCallback((newMinutes: number) => {
    console.log('Setting minutes to:', newMinutes);
    // Update both minutes and timeLeft states
    setMinutesState(newMinutes);
    setTimeLeft(newMinutes * 60);
    // Notify parent component if callback exists
    if (onDurationChange) {
      onDurationChange(newMinutes);
    }
  }, [onDurationChange]);

  const start = useCallback(() => {
    setIsRunning(true);
    if (!metrics.startTime) {
      setMetrics(prev => ({
        ...prev,
        startTime: new Date(),
      }));
    }
    toast("Timer started! You've got this! 🚀");
  }, [metrics.startTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      pauseCount: prev.pauseCount + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
    setMetrics({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      expectedTime: minutes * 60,
      actualDuration: 0,
      favoriteQuotes: 0,
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: 'Completed On Time'
    });
  }, [minutes]);

  const addTime = useCallback((additionalMinutes: number) => {
    setTimeLeft((prev) => prev + (additionalMinutes * 60));
    toast(`Added ${additionalMinutes} minutes. Keep the momentum going! 💪`);
  }, []);

  const completeTimer = useCallback(() => {
    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      endTime: new Date(),
      actualDuration: prev.startTime 
        ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
        : prev.actualDuration,
    }));
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            completeTimer();
            onTimeUp?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp, completeTimer]);

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