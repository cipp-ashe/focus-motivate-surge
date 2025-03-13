
import { useCallback } from 'react';
import { TimerAction } from '@/types/timer';
import { UseTimerActionsReturn } from './types/UseTimerTypes';

interface UseTimerActionsProps {
  dispatch: React.Dispatch<TimerAction>;
  intervalRef: React.RefObject<NodeJS.Timeout | null>;
}

export const useTimerActions = ({
  dispatch,
  intervalRef,
}: UseTimerActionsProps): UseTimerActionsReturn => {
  const startTimer = useCallback(() => {
    dispatch({ type: 'START' });
    dispatch({ type: 'SET_START_TIME', payload: new Date() });
  }, [dispatch]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE' });
    dispatch({ type: 'SET_LAST_PAUSE_TIMESTAMP', payload: new Date() });
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const extendTimer = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    dispatch({ type: 'EXTEND', payload: seconds });
    dispatch({ type: 'SET_EXTENSION_TIME', payload: seconds });
  }, [dispatch]);

  const setMinutes = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    dispatch({ type: 'INIT', payload: { duration: seconds } });
  }, [dispatch]);

  const completeTimer = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
  }, [dispatch]);

  const updateMetrics = useCallback((updates: any) => {
    dispatch({ type: 'UPDATE_METRICS', payload: updates });
  }, [dispatch]);

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    setMinutes,
    completeTimer,
    updateMetrics
  };
};
