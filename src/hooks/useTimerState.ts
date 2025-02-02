import { useEffect, useCallback } from 'react';
import { TimerStateMetrics } from '../types/metrics';
import { useTimerMetrics } from './useTimerMetrics';
import { useTimerControls } from './useTimerControls';

interface UseTimerStateProps {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

export const useTimerState = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerStateProps) => {
  const {
    timeLeft,
    minutes,
    isRunning,
    setMinutes,
    start,
    pause,
    addTime: addTimeControl,
    reset: resetControl,
    decrementTime,
  } = useTimerControls({ initialDuration, onTimeUp, onDurationChange });

  const {
    metrics,
    updateMetrics,
    calculateFinalMetrics,
  } = useTimerMetrics(initialDuration);

  const startTimer = useCallback(() => {
    // If resuming from pause, calculate accumulated pause time
    if (metrics.isPaused && metrics.lastPauseTimestamp) {
      const pauseDuration = Math.floor(
        (new Date().getTime() - metrics.lastPauseTimestamp.getTime()) / 1000
      );
      updateMetrics({
        pausedTime: metrics.pausedTime + pauseDuration,
        isPaused: false,
        pausedTimeLeft: null,
        lastPauseTimestamp: null,
      });
    } else {
      // Starting fresh
      updateMetrics({
        startTime: metrics.startTime || new Date(),
        isPaused: false,
        pausedTimeLeft: null,
        lastPauseTimestamp: null,
      });
    }
    start();
  }, [metrics, start, updateMetrics]);

  const pauseTimer = useCallback(() => {
    if (metrics.isPaused || metrics.endTime) return;

    updateMetrics({
      isPaused: true,
      pausedTimeLeft: timeLeft,
      lastPauseTimestamp: new Date(),
      pauseCount: metrics.pauseCount + 1,
    });
    pause();
  }, [metrics, timeLeft, updateMetrics, pause]);

  const addTime = useCallback((additionalMinutes: number) => {
    if (metrics.endTime) {
      console.warn('Cannot add time to completed timer');
      return;
    }

    const additionalSeconds = additionalMinutes * 60;
    updateMetrics({
      extensionTime: metrics.extensionTime + additionalSeconds,
      originalDuration: metrics.originalDuration + additionalSeconds,
      pausedTimeLeft: metrics.isPaused ? timeLeft + additionalSeconds : metrics.pausedTimeLeft,
    });
    addTimeControl(additionalMinutes);
  }, [metrics, timeLeft, updateMetrics, addTimeControl]);

  const completeTimer = useCallback(async (): Promise<TimerStateMetrics> => {
    const finalMetrics = await calculateFinalMetrics(new Date());
    resetControl();
    return finalMetrics;
  }, [calculateFinalMetrics, resetControl]);

  const reset = useCallback(() => {
    resetControl();
    updateMetrics({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      originalDuration: minutes * 60,
      actualDuration: 0,
      favoriteQuotes: metrics.favoriteQuotes,
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: 'Completed On Time',
      isPaused: false,
      pausedTimeLeft: null,
    });
  }, [minutes, metrics.favoriteQuotes, resetControl, updateMetrics]);

  const incrementFavorites = useCallback(() => {
    updateMetrics({
      favoriteQuotes: metrics.favoriteQuotes + 1,
    });
  }, [metrics.favoriteQuotes, updateMetrics]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(decrementTime, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, decrementTime]);

  return {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start: startTimer,
    pause: pauseTimer,
    reset,
    addTime,
    setMinutes,
    incrementFavorites,
    completeTimer,
  };
};