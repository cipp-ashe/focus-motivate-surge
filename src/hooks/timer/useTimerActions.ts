import { useCallback } from 'react';
import { TimerAction } from '@/types/timer';
import { UseTimerActionsProps, UseTimerActionsReturn, TimerActionProps } from './types/UseTimerTypes';
import { 
  determineCompletionStatus, 
  calculateEfficiencyRatio 
} from '@/lib/utils/formatters';
import { toISOString } from '@/lib/utils/dateUtils';

export const useTimerActions = (
  props: UseTimerActionsProps | TimerActionProps
): UseTimerActionsReturn => {
  const isLegacyInterface = 'timeLeft' in props;
  
  const startTimer = useCallback(() => {
    if (isLegacyInterface) {
      const { setIsRunning, updateMetrics } = props as TimerActionProps;
      console.log("useTimerActions: Starting timer (legacy)");
      setIsRunning(true);
      updateMetrics({
        startTime: new Date(),
        isPaused: false
      });
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      
      console.log("useTimerActions: Starting timer (reducer)");
      dispatch({ type: 'START' });
      dispatch({ type: 'SET_START_TIME', payload: new Date() });
    }
  }, [props, isLegacyInterface]);

  const pauseTimer = useCallback(() => {
    if (isLegacyInterface) {
      const { timeLeft, setIsRunning, updateMetrics } = props as TimerActionProps;
      console.log("useTimerActions: Pausing timer (legacy)");
      setIsRunning(false);
      updateMetrics({
        pauseCount: (props as TimerActionProps).metrics.pauseCount + 1,
        lastPauseTimestamp: new Date(),
        isPaused: true,
        pausedTimeLeft: timeLeft
      });
    } else {
      const { dispatch } = props as UseTimerActionsProps;
      
      console.log("useTimerActions: Pausing timer (reducer)");
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_LAST_PAUSE_TIMESTAMP', payload: new Date() });
    }
  }, [props, isLegacyInterface]);

  const resetTimer = useCallback(async (): Promise<void> => {
    if (isLegacyInterface) {
      const { updateTimeLeft, setIsRunning, updateMetrics } = props as TimerActionProps;
      const legacyProps = props as TimerActionProps;
      
      console.log("useTimerActions: Resetting timer (legacy)");
      setIsRunning(false);
      updateTimeLeft(legacyProps.metrics.expectedTime);
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
      return Promise.resolve();
    } else {
      const { dispatch, resetTimer: propsResetTimer } = props as UseTimerActionsProps;
      console.log("useTimerActions: Resetting timer (reducer)");
      
      if (propsResetTimer) {
        return propsResetTimer();
      } else {
        dispatch({ type: 'RESET' });
        return Promise.resolve();
      }
    }
  }, [props, isLegacyInterface]);

  const extendTimer = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    if (isLegacyInterface) {
      const { timeLeft, updateTimeLeft, updateMetrics } = props as TimerActionProps;
      console.log(`useTimerActions: Extending timer by ${minutes} minutes (legacy)`);
      updateTimeLeft(timeLeft + seconds);
      updateMetrics({
        extensionTime: (props as TimerActionProps).metrics.extensionTime + seconds
      });
    } else {
      const { dispatch, extendTimer: propsExtendTimer } = props as UseTimerActionsProps;
      console.log(`useTimerActions: Extending timer by ${minutes} minutes (reducer)`);
      
      if (propsExtendTimer) {
        propsExtendTimer(minutes);
      } else {
        dispatch({ type: 'EXTEND', payload: seconds });
        dispatch({ type: 'SET_EXTENSION_TIME', payload: seconds });
      }
    }
  }, [props, isLegacyInterface]);

  const setMinutes = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    if (isLegacyInterface) {
      const { updateTimeLeft } = props as TimerActionProps;
      console.log(`useTimerActions: Setting timer to ${minutes} minutes (legacy)`);
      updateTimeLeft(seconds);
    } else {
      const { dispatch, setMinutes: propsSetMinutes } = props as UseTimerActionsProps;
      console.log(`useTimerActions: Setting timer to ${minutes} minutes (reducer)`);
      
      if (propsSetMinutes) {
        propsSetMinutes(minutes);
      } else {
        dispatch({ type: 'INIT', payload: { duration: seconds } });
      }
    }
  }, [props, isLegacyInterface]);

  const completeTimer = useCallback(async (): Promise<void> => {
    try {
      if (isLegacyInterface) {
        const { setIsRunning, updateMetrics, metrics } = props as TimerActionProps;
        const now = new Date();
        console.log("useTimerActions: Completing timer (legacy)");
        
        // Make sure we have a startTime
        const startTime = metrics.startTime || new Date(now.getTime() - (metrics.expectedTime * 1000));
        
        // Calculate actual duration in seconds
        const actualDuration = Math.floor((now.getTime() - (startTime instanceof Date ? startTime.getTime() : new Date(startTime).getTime())) / 1000);
        
        // Calculate effective working time (accounting for pauses)
        const pausedTime = metrics.pausedTime || 0;
        const extensionTime = metrics.extensionTime || 0;
        const netEffectiveTime = Math.max(0, actualDuration - pausedTime + extensionTime);
        
        // Calculate efficiency metrics
        const efficiencyRatio = calculateEfficiencyRatio(metrics.expectedTime, netEffectiveTime);
        const completionStatus = determineCompletionStatus(metrics.expectedTime, netEffectiveTime) as 
          "Completed Early" | "Completed On Time" | "Completed Late" | "Completed Very Early" | "Completed Very Late";
        
        // Create a properly formatted completion metrics object with serializable dates
        const updatedMetrics = {
          startTime: startTime instanceof Date ? toISOString(startTime) : startTime,
          endTime: toISOString(now),
          actualDuration,
          pausedTime,
          extensionTime,
          netEffectiveTime,
          efficiencyRatio,
          completionStatus,
          isPaused: false,
          pausedTimeLeft: null,
          // Always ensure completionDate is a properly formatted ISO string
          completionDate: toISOString(now)
        };
        
        console.log("useTimerActions: Completing timer with metrics:", updatedMetrics);
        
        // Update state and metrics
        setIsRunning(false);
        updateMetrics(updatedMetrics);
        
        // Return a resolved promise
        return Promise.resolve();
      } else {
        const { dispatch } = props as UseTimerActionsProps;
        
        console.log("useTimerActions: Completing timer (reducer)");
        dispatch({ type: 'COMPLETE' });
        return Promise.resolve();
      }
    } catch (error) {
      console.error("Error in completeTimer:", error);
      return Promise.reject(error);
    }
  }, [props, isLegacyInterface]);
  
  const updateMetricsFunc = useCallback((updates: any) => {
    if (isLegacyInterface) {
      const { updateMetrics } = props as TimerActionProps;
      updateMetrics(updates);
    } else {
      const { dispatch, updateMetrics: propsUpdateMetrics } = props as UseTimerActionsProps;
      if (propsUpdateMetrics) {
        propsUpdateMetrics(updates);
      } else {
        dispatch({ type: 'UPDATE_METRICS', payload: updates });
      }
    }
  }, [props, isLegacyInterface]);

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    setMinutes,
    completeTimer,
    updateMetrics: updateMetricsFunc
  };
};
