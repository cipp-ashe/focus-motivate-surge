
import { useCallback } from 'react';
import { TimerStateMetrics } from '@/types/metrics';

interface UseTimerActionsProps {
  timeLeft: number;
  metrics: TimerStateMetrics;
  updateTimeLeft: (timeLeft: number) => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setIsRunning: (isRunning: boolean) => void;
}

export const useTimerActions = ({
  timeLeft,
  metrics,
  updateTimeLeft,
  updateMetrics,
  setIsRunning,
}: UseTimerActionsProps) => {
  const startTimer = useCallback(() => {
    console.log('Starting timer');
    setIsRunning(true);
    
    // Set start time if not already set
    if (!metrics.startTime) {
      updateMetrics({
        startTime: new Date(),
        isPaused: false
      });
    }
  }, [setIsRunning, metrics.startTime, updateMetrics]);
  
  const pauseTimer = useCallback(() => {
    console.log('Pausing timer');
    setIsRunning(false);
    
    updateMetrics({
      pauseCount: metrics.pauseCount + 1,
      lastPauseTimestamp: new Date(),
      isPaused: true,
      pausedTimeLeft: timeLeft
    });
  }, [setIsRunning, metrics.pauseCount, updateMetrics, timeLeft]);
  
  const resetTimer = useCallback(() => {
    console.log('Resetting timer');
    setIsRunning(false);
    updateTimeLeft(metrics.expectedTime || 0);
    
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
  }, [setIsRunning, updateTimeLeft, metrics.expectedTime, updateMetrics]);
  
  const extendTimer = useCallback((minutes: number) => {
    console.log(`Extending timer by ${minutes} minutes`);
    const extensionSeconds = minutes * 60;
    
    // Add time to timeLeft
    updateTimeLeft(timeLeft + extensionSeconds);
    
    // Update metrics
    updateMetrics({
      extensionTime: (metrics.extensionTime || 0) + extensionSeconds
    });
  }, [updateTimeLeft, timeLeft, updateMetrics, metrics.extensionTime]);
  
  const completeTimer = useCallback(() => {
    console.log('Completing timer');
    setIsRunning(false);
    
    // Calculate metrics
    const startTime = metrics.startTime ? new Date(metrics.startTime) : new Date();
    const endTime = new Date();
    const elapsedSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Calculate effective time (actual - paused)
    const netEffective = Math.max(0, elapsedSeconds - (metrics.pausedTime || 0));
    
    // Calculate efficiency ratio
    const expectedTime = metrics.expectedTime || 1500; // Default to 25 minutes
    const efficiencyRatio = expectedTime > 0 ? netEffective / expectedTime : 0;
    
    // Determine completion status
    let completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late' = 'Completed On Time';
    
    if (metrics.extensionTime && metrics.extensionTime > 0) {
      completionStatus = 'Completed Late';
    } else if (timeLeft > 0 && timeLeft < expectedTime) {
      completionStatus = 'Completed Early';
    }
    
    // Update final metrics
    const finalMetrics = {
      endTime,
      actualDuration: elapsedSeconds,
      netEffectiveTime: netEffective,
      efficiencyRatio,
      completionStatus,
      isPaused: false
    };
    
    updateMetrics(finalMetrics);
    
    // Return full metrics object
    return {
      ...metrics,
      ...finalMetrics
    };
  }, [setIsRunning, metrics, updateMetrics, timeLeft]);
  
  return {
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    completeTimer,
    updateMetrics
  };
};
