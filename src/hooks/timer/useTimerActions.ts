
import { useCallback, Dispatch } from 'react';
import { TimerState, TimerAction } from '@/types/timer';
import { TimerStateMetrics } from '@/types/metrics';
import { eventBus } from '@/lib/eventBus';

export const useTimerActions = (state: TimerState, dispatch: Dispatch<TimerAction>) => {
  const startTimer = useCallback(() => {
    if (!state.isRunning) {
      dispatch({ type: 'START' });
      dispatch({ type: 'SET_START_TIME', payload: new Date() });
      eventBus.emit('timer:start', {
        taskName: 'Task', // Default value
        duration: state.timeLeft,
        currentTime: state.timeLeft
      });
    }
  }, [state.isRunning, dispatch, state.timeLeft]);

  const pauseTimer = useCallback(() => {
    if (state.isRunning && !state.isPaused) {
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_LAST_PAUSE_TIMESTAMP', payload: new Date() });
      eventBus.emit('timer:pause', {
        taskName: 'Task', // Default value
        timeLeft: state.timeLeft,
        metrics: state.metrics
      });
    }
  }, [state.isRunning, state.isPaused, dispatch, state.timeLeft, state.metrics]);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET' });
    eventBus.emit('timer:reset', {
      taskName: 'Task', // Default value
      duration: state.metrics.expectedTime
    });
  }, [dispatch, state.metrics.expectedTime]);

  const extendTimer = useCallback((minutes: number) => {
    dispatch({ type: 'EXTEND', payload: minutes * 60 });
    dispatch({ type: 'SET_EXTENSION_TIME', payload: minutes * 60 });
  }, [dispatch]);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics>) => {
    dispatch({ type: 'UPDATE_METRICS', payload: updates });
    eventBus.emit('timer:metrics-update', {
      taskName: 'Task', // Default value
      metrics: updates
    });
  }, [dispatch]);

  const completeTimer = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
    eventBus.emit('timer:complete', {
      taskName: 'Task', // Default value
      metrics: state.metrics
    });
    
    const endTime = new Date();
    const actualDuration = (endTime.getTime() - (state.metrics.startTime?.getTime() || endTime.getTime())) / 1000;
    const netEffectiveTime = actualDuration - state.metrics.pausedTime;
    const efficiencyRatio = state.metrics.expectedTime ? Math.min((netEffectiveTime / state.metrics.expectedTime) * 100, 200) : 0;
    
    const updatedMetrics: TimerStateMetrics = {
      ...state.metrics,
      endTime,
      actualDuration,
      netEffectiveTime,
      efficiencyRatio,
      completionStatus: 'Completed On Time',
      favoriteQuotes: [], // Fix: Changed from number to string[]
    };
    
    updateMetrics(updatedMetrics);
  }, [state.metrics, dispatch, updateMetrics]);

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    updateMetrics,
    completeTimer,
  };
};
