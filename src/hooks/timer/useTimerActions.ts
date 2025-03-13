
import { useCallback } from 'react';
import { TimerAction } from '@/types/timer';
import { UseTimerActionsProps, UseTimerActionsReturn, TimerActionProps } from './types/UseTimerTypes';
import { determineCompletionStatus, calculateEfficiencyRatio } from '@/lib/utils/formatters';

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
      
      // Make sure we have a startTime
      const startTime = metrics.startTime || new Date(now.getTime() - (metrics.expectedTime * 1000));
      
      // Calculate actual duration in seconds
      const actualDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      
      // Calculate effective working time (accounting for pauses)
      const pausedTime = metrics.pausedTime || 0;
      const extensionTime = metrics.extensionTime || 0;
      const netEffectiveTime = Math.max(0, actualDuration - pausedTime + extensionTime);
      
      // Calculate efficiency metrics
      const efficiencyRatio = calculateEfficiencyRatio(metrics.expectedTime, netEffectiveTime);
      const completionStatus = determineCompletionStatus(metrics.expectedTime, netEffectiveTime);
      
      // Create a properly formatted completion metrics object
      const updatedMetrics = {
        startTime: startTime,
        endTime: now,
        actualDuration,
        pausedTime,
        extensionTime,
        netEffectiveTime,
        efficiencyRatio,
        completionStatus,
        isPaused: false,
        pausedTimeLeft: null,
        completionDate: now.toISOString() // Convert Date to string for storage
      };
      
      // Update state and metrics
      setIsRunning(false);
      updateMetrics(updatedMetrics);
      
      // Return the complete metrics
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
