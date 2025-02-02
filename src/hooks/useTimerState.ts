import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { TimerStateMetrics } from '../types/metrics';

interface UseTimerStateProps {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

interface TimerState {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerStateMetrics;
}

const calculateEfficiencyRatio = (originalDuration: number, netEffectiveTime: number): number => {
  if (netEffectiveTime === 0) return 0;
  const ratio = (originalDuration / netEffectiveTime) * 100;
  return Math.min(ratio, 100);
};

const determineCompletionStatus = (originalDuration: number, netEffectiveTime: number) => {
  if (netEffectiveTime < originalDuration) return 'Completed Early';
  if (netEffectiveTime === originalDuration) return 'Completed On Time';
  return 'Completed Late';
};

const initialMetrics = (duration: number): TimerStateMetrics => ({
  startTime: null,
  endTime: null,
  pauseCount: 0,
  originalDuration: duration,
  actualDuration: 0,
  favoriteQuotes: 0,
  pausedTime: 0,
  lastPauseTimestamp: null,
  extensionTime: 0,
  netEffectiveTime: 0,
  efficiencyRatio: 0,
  completionStatus: 'Completed On Time',
  isPaused: false,
  pausedTimeLeft: null,
});

export const useTimerState = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerStateProps) => {
  const [state, setState] = useState<TimerState>(() => ({
    timeLeft: Math.max(0, initialDuration),
    minutes: Math.floor(Math.max(0, initialDuration) / 60),
    isRunning: false,
    metrics: initialMetrics(initialDuration),
  }));

  useEffect(() => {
    if (!state.isRunning && !state.metrics.isPaused && initialDuration > 0 && !state.metrics.endTime) {
      setState(prev => ({
        ...prev,
        timeLeft: initialDuration,
        minutes: Math.floor(initialDuration / 60),
        metrics: initialMetrics(initialDuration),
      }));
    }
  }, [initialDuration, state.isRunning, state.metrics.isPaused, state.metrics.endTime]);

  const setMinutes = useCallback((newMinutes: number) => {
    if (!state.isRunning && !state.metrics.isPaused) {
      setState(prev => ({
        ...prev,
        minutes: newMinutes,
        timeLeft: newMinutes * 60,
        metrics: {
          ...initialMetrics(newMinutes * 60),
          pausedTimeLeft: null,
          isPaused: false,
        },
      }));
      onDurationChange?.(newMinutes);
    }
  }, [onDurationChange, state.isRunning, state.metrics.isPaused]);

  const start = useCallback(() => {
    setState(prev => {
      const now = new Date();
      const additionalPausedTime = prev.metrics.lastPauseTimestamp
        ? Math.floor((now.getTime() - prev.metrics.lastPauseTimestamp.getTime()) / 1000)
        : 0;

      const updatedMetrics = {
        ...prev.metrics,
        startTime: prev.metrics.startTime || now,
        pausedTime: prev.metrics.pausedTime + additionalPausedTime,
        lastPauseTimestamp: null,
        isPaused: false,
        pausedTimeLeft: null,
      };

      const newTimeLeft = prev.metrics.isPaused && prev.metrics.pausedTimeLeft !== null
        ? prev.metrics.pausedTimeLeft
        : prev.timeLeft;

      return {
        ...prev,
        isRunning: true,
        timeLeft: newTimeLeft,
        metrics: updatedMetrics,
      };
    });
    
    toast(state.metrics.isPaused ? "Timer resumed! Keep going! 💪" : "Timer started! You've got this! 🚀");
  }, [state.metrics.isPaused]);

  const pause = useCallback(() => {
    setState(prev => {
      if (prev.metrics.isPaused || prev.metrics.endTime) {
        return prev;
      }

      const now = new Date();
      const updatedMetrics = {
        ...prev.metrics,
        isPaused: true,
        pausedTimeLeft: prev.timeLeft,
        lastPauseTimestamp: now,
        pauseCount: prev.metrics.pauseCount + 1,
      };

      return {
        ...prev,
        isRunning: false,
        metrics: updatedMetrics,
      };
    });

    toast("Timer paused! Take a breather 😌");
  }, []);

  const addTime = useCallback((additionalMinutes: number) => {
    if (additionalMinutes <= 0) {
      console.warn('Invalid addTime value:', additionalMinutes);
      return;
    }

    setState(prev => {
      if (prev.metrics.endTime) {
        console.warn('Cannot add time to completed timer');
        return prev;
      }

      const additionalSeconds = additionalMinutes * 60;
      const newTime = Math.max(0, prev.timeLeft + additionalSeconds);
      
      const updatedMetrics = {
        ...prev.metrics,
        pausedTimeLeft: prev.metrics.isPaused ? newTime : prev.metrics.pausedTimeLeft,
        extensionTime: prev.metrics.extensionTime + additionalSeconds,
        originalDuration: prev.metrics.originalDuration + additionalSeconds
      };

      return {
        ...prev,
        timeLeft: newTime,
        minutes: Math.ceil(newTime / 60),
        metrics: updatedMetrics,
      };
    });

    toast(`Added ${additionalMinutes} minutes. Keep going! 💪`);
  }, []);

  const completeTimer = useCallback(async (): Promise<TimerStateMetrics> => {
    const completionTime = new Date();
    let finalMetrics: TimerStateMetrics;
    
    return new Promise((resolve) => {
      setState(prev => {
        const elapsedMs = prev.metrics.startTime
          ? completionTime.getTime() - prev.metrics.startTime.getTime()
          : 0;
        
        const actualDuration = Math.max(1, Math.round(elapsedMs / 1000));
        const netEffectiveTime = actualDuration - prev.metrics.pausedTime;
        const efficiencyRatio = Math.min(100, Math.max(0,
          netEffectiveTime > 0 ? (prev.metrics.originalDuration / netEffectiveTime) * 100 : 0
        ));

        const completionStatus = determineCompletionStatus(
          prev.metrics.originalDuration,
          netEffectiveTime
        );

        finalMetrics = {
          ...prev.metrics,
          endTime: completionTime,
          actualDuration,
          netEffectiveTime,
          efficiencyRatio,
          completionStatus,
          isPaused: false,
          pausedTimeLeft: null,
          lastPauseTimestamp: null,
          pausedTime: prev.metrics.pausedTime,
          pauseCount: prev.metrics.pauseCount,
          favoriteQuotes: prev.metrics.favoriteQuotes,
          originalDuration: prev.metrics.originalDuration,
          startTime: prev.metrics.startTime,
          extensionTime: prev.metrics.extensionTime
        };

        return {
          ...prev,
          isRunning: false,
          metrics: finalMetrics,
        };
      });

      // Resolve with the final metrics after state is updated
      resolve(finalMetrics!);
    });
  }, []);

  const reset = useCallback(() => {
    setState(prev => {
      const duration = prev.minutes * 60;
      
      if (prev.metrics.endTime) {
        return {
          ...prev,
          isRunning: false,
          timeLeft: duration,
          metrics: initialMetrics(duration),
        };
      }
      
      if (prev.metrics.isPaused) {
        return {
          ...prev,
          isRunning: false,
          timeLeft: duration,
          metrics: {
            ...initialMetrics(duration),
            startTime: null,
            pausedTimeLeft: null,
            isPaused: false,
            lastPauseTimestamp: null,
          },
        };
      }
      
      return {
        ...prev,
        isRunning: false,
        timeLeft: duration,
        metrics: {
          ...initialMetrics(duration),
          favoriteQuotes: prev.metrics.favoriteQuotes,
        },
      };
    });

    console.debug('Timer reset');
  }, []);

  const incrementFavorites = useCallback(() => {
    setState(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        favoriteQuotes: prev.metrics.favoriteQuotes + 1,
      },
    }));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let completionTimeout: NodeJS.Timeout;
    
    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          
          if (newTimeLeft <= 0) {
            clearInterval(interval);
            completionTimeout = setTimeout(() => {
              completeTimer();
              onTimeUp?.();
            }, 0);
            
            return { ...prev, timeLeft: 0, isRunning: false };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (completionTimeout) clearTimeout(completionTimeout);
    };
  }, [state.isRunning, state.timeLeft, onTimeUp, completeTimer]);

  return {
    timeLeft: state.timeLeft,
    minutes: state.minutes,
    isRunning: state.isRunning,
    metrics: state.metrics,
    start,
    pause,
    reset,
    addTime,
    setMinutes,
    incrementFavorites,
    completeTimer,
  };
};
