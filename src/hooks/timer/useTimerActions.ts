
import { useCallback } from 'react';
import { TimerAction } from '@/types/timer';
import { UseTimerActionsProps, UseTimerActionsReturn, TimerActionProps } from './types/UseTimerTypes';

// This function supports both the new interface (dispatch-based) and the legacy interface (direct update methods)
export const useTimerActions = (
  props: UseTimerActionsProps | TimerActionProps
): UseTimerActionsReturn => {
  // Determine which interface we're using
  const isLegacyInterface = 'timeLeft' in props;
  
  // Wrap based on interface type
  const startTimer = useCallback(() => {
    if (isLegacyInterface) {
      const { setIsRunning, updateMetrics } = props as TimerActionProps;
      setIsRunning(true);
      updateMetrics({
        startTime: new Date(),
        isPaused: false
      });
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      dispatch({ type: 'START' });
      dispatch({ type: 'SET_START_TIME', payload: new Date() });
    }
  }, [props, isLegacyInterface]);

  const pauseTimer = useCallback(() => {
    if (isLegacyInterface) {
      const { timeLeft, setIsRunning, updateMetrics } = props as TimerActionProps;
      setIsRunning(false);
      updateMetrics({
        pauseCount: (props as TimerActionProps).metrics.pauseCount + 1,
        lastPauseTimestamp: new Date(),
        isPaused: true,
        pausedTimeLeft: timeLeft
      });
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_LAST_PAUSE_TIMESTAMP', payload: new Date() });
    }
  }, [props, isLegacyInterface]);

  const resetTimer = useCallback(() => {
    if (isLegacyInterface) {
      const { updateTimeLeft, setIsRunning, updateMetrics } = props as TimerActionProps;
      setIsRunning(false);
      updateTimeLeft((props as TimerActionProps).metrics.expectedTime);
      updateMetrics({
        startTime: null,
        endTime: null,
        pauseCount: 0,
        actualDuration: 0,
        pausedTime: 0,
        lastPauseTimestamp: null,
        extensionTime: 0,
        isPaused: false,
        pausedTimeLeft: null
      });
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      dispatch({ type: 'RESET' });
    }
  }, [props, isLegacyInterface]);

  const extendTimer = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    if (isLegacyInterface) {
      const { timeLeft, updateTimeLeft, updateMetrics } = props as TimerActionProps;
      updateTimeLeft(timeLeft + seconds);
      updateMetrics({
        extensionTime: seconds
      });
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      dispatch({ type: 'EXTEND', payload: seconds });
      dispatch({ type: 'SET_EXTENSION_TIME', payload: seconds });
    }
  }, [props, isLegacyInterface]);

  const setMinutes = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    if (isLegacyInterface) {
      const { updateTimeLeft } = props as TimerActionProps;
      updateTimeLeft(seconds);
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      dispatch({ type: 'INIT', payload: { duration: seconds } });
    }
  }, [props, isLegacyInterface]);

  const completeTimer = useCallback(() => {
    if (isLegacyInterface) {
      const { setIsRunning, updateMetrics, metrics } = props as TimerActionProps;
      const now = new Date();
      const actualDuration = metrics.startTime 
        ? Math.floor((now.getTime() - metrics.startTime.getTime()) / 1000) 
        : 0;
      
      const netEffectiveTime = actualDuration - metrics.pausedTime;
      const efficiencyRatio = metrics.expectedTime > 0 
        ? (netEffectiveTime / metrics.expectedTime) 
        : 1;
      
      let completionStatus = 'Completed On Time';
      if (efficiencyRatio < 0.8) completionStatus = 'Completed Early';
      if (efficiencyRatio > 1.2) completionStatus = 'Completed Late';
      
      const updatedMetrics = {
        endTime: now,
        actualDuration,
        netEffectiveTime,
        efficiencyRatio,
        completionStatus,
        isPaused: false,
        completionDate: now
      };
      
      setIsRunning(false);
      updateMetrics(updatedMetrics);
      
      return {
        ...metrics,
        ...updatedMetrics
      };
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      dispatch({ type: 'COMPLETE' });
    }
  }, [props, isLegacyInterface]);

  const updateMetrics = useCallback((updates: any) => {
    if (isLegacyInterface) {
      const { updateMetrics } = props as TimerActionProps;
      updateMetrics(updates);
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      dispatch({ type: 'UPDATE_METRICS', payload: updates });
    }
  }, [props, isLegacyInterface]);

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
