import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { TimerMetrics } from '../types/metrics';

interface UseTimerStateProps {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

interface TimerState {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  isPaused: boolean;
  pausedTimeLeft: number | null;
  metrics: TimerMetrics;
}

const initialMetrics = (duration: number): TimerMetrics => ({
  startTime: null,
  endTime: null,
  pauseCount: 0,
  originalDuration: duration,
  actualDuration: 0,
  favoriteQuotes: 0,
});

export const useTimerState = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerStateProps) => {
  const [state, setState] = useState<TimerState>({
    timeLeft: initialDuration,
    minutes: Math.floor(initialDuration / 60),
    isRunning: false,
    isPaused: false,
    pausedTimeLeft: null,
    metrics: initialMetrics(initialDuration),
  });

  // Reset timer when initial duration changes and timer is not running or paused
  useEffect(() => {
    console.log('Timer State - Initial duration changed:', initialDuration);
    if (!state.isRunning && !state.isPaused && initialDuration > 0) {
      console.log('Timer State - Updating time left and minutes');
      setState(prev => ({
        ...prev,
        timeLeft: initialDuration,
        minutes: Math.floor(initialDuration / 60),
        metrics: initialMetrics(initialDuration),
        pausedTimeLeft: null,
        isPaused: false,
      }));
    }
  }, [initialDuration, state.isRunning, state.isPaused]);

  const setMinutes = useCallback((newMinutes: number) => {
    console.log('Timer State - Setting minutes to:', newMinutes);
    if (!state.isRunning && !state.isPaused) {
      setState(prev => ({
        ...prev,
        minutes: newMinutes,
        timeLeft: newMinutes * 60,
        pausedTimeLeft: null,
        isPaused: false,
      }));
      onDurationChange?.(newMinutes);
    }
  }, [onDurationChange, state.isRunning, state.isPaused]);

  const start = useCallback(() => {
    console.log('Timer State - Starting timer');
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      metrics: {
        ...prev.metrics,
        startTime: prev.metrics.startTime || new Date(),
      },
      timeLeft: prev.isPaused && prev.pausedTimeLeft !== null 
        ? prev.pausedTimeLeft 
        : prev.timeLeft,
    }));
    
    toast(state.isPaused ? "Timer resumed! Keep going! 💪" : "Timer started! You've got this! 🚀");
  }, [state.isPaused]);

  const pause = useCallback(() => {
    console.log('Timer State - Pausing timer');
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true,
      pausedTimeLeft: prev.timeLeft,
      metrics: {
        ...prev.metrics,
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
      isPaused: false,
      timeLeft: prev.minutes * 60,
      metrics: initialMetrics(prev.minutes * 60),
      pausedTimeLeft: null,
    }));
  }, []);

  const addTime = useCallback((additionalMinutes: number) => {
    console.log('Timer State - Adding minutes:', additionalMinutes);
    setState(prev => {
      const newTime = prev.timeLeft + (additionalMinutes * 60);
      return {
        ...prev,
        timeLeft: newTime,
        pausedTimeLeft: prev.isPaused ? newTime : prev.pausedTimeLeft,
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
      },
    }));
  }, []);

  // Timer countdown effect
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