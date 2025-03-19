
import { useCallback, useEffect, useRef } from "react";
import { logger } from "@/utils/logManager";
import { eventManager } from "@/lib/events/EventManager";

interface UseTimerMonitoringProps {
  taskName: string;
  updateTimeLeft: (newTimeLeft: number) => void;
  handleComplete: () => Promise<void>;
}

/**
 * Hook for monitoring the timer and ensuring it's synchronized with other parts of the app.
 * This hook returns a function that can be used to manually check the timer state.
 */
export const useTimerMonitoring = ({ 
  taskName, 
  updateTimeLeft, 
  handleComplete 
}: UseTimerMonitoringProps) => {
  const timerSyncRef = useRef<boolean>(false);
  
  // Set up timer synchronization logic
  useEffect(() => {
    // Only set up monitoring if we have a task name
    if (!taskName) return;
    
    logger.debug('TimerMonitoring', `Monitoring timer for task: ${taskName}`);
    
    // Custom window event for browser timers
    const handleWindowTimerSync = (event: any) => {
      if (event.detail && event.detail.timeLeft !== undefined) {
        updateTimeLeft(event.detail.timeLeft);
        logger.debug('TimerMonitoring', `Synchronized timer with window event: ${event.detail.timeLeft}s`);
      }
    };
    
    window.addEventListener('timer:sync', handleWindowTimerSync);
    
    // Set up timer event listeners for synchronization
    const unsubTick = eventManager.on('timer:tick', (payload) => {
      if (payload.taskName === taskName && payload.timeLeft !== undefined) {
        // Only update if the timeLeft is different, to prevent infinite loops
        updateTimeLeft(payload.timeLeft);
      }
    });
    
    // Handle timer complete events
    const unsubComplete = eventManager.on('timer:complete', async (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerMonitoring', `Timer complete event received for task: ${taskName}`);
        
        try {
          await handleComplete();
        } catch (error) {
          logger.error('TimerMonitoring', `Error handling timer complete: ${error}`);
        }
      }
    });
    
    // Mark timer as initialized
    eventManager.emit('timer:initialized', {
      taskName,
      timestamp: new Date().toISOString()
    });
    
    // Cleanup when unmounting
    return () => {
      logger.debug('TimerMonitoring', `Stopped monitoring timer for task: ${taskName}`);
      window.removeEventListener('timer:sync', handleWindowTimerSync);
      unsubTick();
      unsubComplete();
    };
  }, [taskName, updateTimeLeft, handleComplete]);
  
  // Return a function for checking timer state
  return useCallback(() => {
    logger.debug('TimerMonitoring', `Manually checking timer state for task: ${taskName}`);
    
    // Request a sync from any timers that might be running
    eventManager.emit('timer:request-sync', {
      taskName,
      timestamp: new Date().toISOString()
    });
  }, [taskName]);
};
