
import { useTimerCore } from './useTimerCore';
import { useTimerActions } from './useTimerActions';
import { UseTimerOptions, UseTimerReturn } from './types/UseTimerTypes';

export const useTimer = (options: UseTimerOptions | number = 25): UseTimerReturn => {
  const { state, dispatch, intervalRef } = useTimerCore(options);
  
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    setMinutes,
    completeTimer,
    updateMetrics
  } = useTimerActions({ dispatch, intervalRef });

  // Calculate minutes from seconds
  const minutes = Math.floor(state.timeLeft / 60);

  return {
    state,
    dispatch,
    timeLeft: state.timeLeft,
    minutes,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    showCompletion: state.showCompletion,
    completionCelebrated: state.completionCelebrated,
    metrics: state.metrics,
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    setMinutes,
    completeTimer,
    updateMetrics
  };
};
