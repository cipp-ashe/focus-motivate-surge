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

const initialMetrics = (duration: number): TimerStateMetrics => ({
  startTime: null,
  endTime: null,
  pauseCount: 0,
  originalDuration: duration,
  actualDuration: 0,
  favoriteQuotes: 0,
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

  // Reset timer when initial duration changes and timer is not running
  useEffect(() => {
    console.log('Timer State - Initial duration changed:', initialDuration);
    if (!state.isRunning && !state.metrics.isPaused && initialDuration > 0) {
      console.log('Timer State - Updating time left and minutes');
      setState(prev => ({
        ...prev,
        timeLeft: initialDuration,
        minutes: Math.floor(initialDuration / 60),
        metrics: initialMetrics(initialDuration),
      }));
    }
  }, [initialDuration, state.isRunning, state.metrics.isPaused]);

  const setMinutes = useCallback((newMinutes: number) => {
    console.log('Timer State - Setting minutes to:', newMinutes);
    if (!state.isRunning && !state.metrics.isPaused) {
      setState(prev => ({
        ...prev,
        minutes: newMinutes,
        timeLeft: newMinutes * 60,
        metrics: {
          ...prev.metrics,
          pausedTimeLeft: null,
          isPaused: false,
        },
      }));
      onDurationChange?.(newMinutes);
    }
  }, [onDurationChange, state.isRunning, state.metrics.isPaused]);

  const start = useCallback(() => {
    console.log('Timer State - Starting timer');
    setState(prev => ({
      ...prev,
      isRunning: true,
      timeLeft: prev.metrics.isPaused && prev.metrics.pausedTimeLeft !== null 
        ? prev.metrics.pausedTimeLeft 
        : prev.timeLeft,
      metrics: {
        ...prev.metrics,
        startTime: prev.metrics.startTime || new Date(),
        isPaused: false,
        pausedTimeLeft: null,
      },
    }));
    
    toast(state.metrics.isPaused ? "Timer resumed! Keep going! 💪" : "Timer started! You've got this! 🚀");
  }, [state.metrics.isPaused]);

  const pause = useCallback(() => {
    console.log('Timer State - Pausing timer');
    setState(prev => ({
      ...prev,
      isRunning: false,
      metrics: {
        ...prev.metrics,
        isPaused: true,
        pausedTimeLeft: prev.timeLeft,
        pauseCount: prev.metrics.pauseCount + 1,
      },
    }));
    toast("Timer paused! Take a breather 😌");
  }, []);

  const reset = useCallback(() => {
    console.log('Timer State - Resetting timer');
    setState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.minutes * 60,
      metrics: initialMetrics(prev.minutes * 60),
    }));
  }, []);

  const addTime = useCallback((additionalMinutes: number) => {
    console.log('Timer State - Adding minutes:', additionalMinutes);
    setState(prev => {
      const newTime = prev.timeLeft + (additionalMinutes * 60);
      return {
        ...prev,
        timeLeft: newTime,
        metrics: {
          ...prev.metrics,
          pausedTimeLeft: prev.metrics.isPaused ? newTime : prev.metrics.pausedTimeLeft,
        },
      };
    });
    toast(`Added ${additionalMinutes} minutes. Keep going! 💪`);
  }, []);

  const completeTimer = useCallback(() => {
    console.log('Timer State - Completing timer');
    setState(prev => ({
      ...prev,
      isRunning: false,
      metrics: {
        ...prev.metrics,
        endTime: new Date(),
        actualDuration: prev.metrics.startTime 
          ? Math.floor((Date.now() - prev.metrics.startTime.getTime()) / 1000)
          : prev.metrics.actualDuration,
        isPaused: false,
        pausedTimeLeft: null,
      },
    }));
  }, []);

  // Timer countdown effect with cleanup
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            completeTimer();
            onTimeUp?.();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        console.log('Timer State - Cleaning up interval');
        clearInterval(interval);
      }
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
    completeTimer,
  };
};