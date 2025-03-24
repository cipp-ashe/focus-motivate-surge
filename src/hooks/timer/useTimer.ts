
import { useTimerCore } from './useTimerCore';
import { useTimerActions } from './useTimerActions';
import { UseTimerOptions, UseTimerReturn } from './types/UseTimerTypes';

export const useTimer = (options: UseTimerOptions | number = 25): UseTimerReturn => {
  const { state, dispatch } = useTimerCore(options);
  
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    setMinutes,
    completeTimer,
    updateMetrics
  } = useTimerActions({ 
    dispatch,
    state
  });

  // Calculate minutes from seconds
  const minutes = Math.floor(state.timeLeft / 60);

  return {
    timeLeft: state.timeLeft,
    minutes,
    isRunning: state.isRunning,
    metrics: state.metrics,
    updateMetrics,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    addTime: extendTimer,
    setMinutes,
    completeTimer
  };
};
