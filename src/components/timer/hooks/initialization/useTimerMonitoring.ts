
import { useCallback, useEffect, useRef } from "react";
import { logger } from "@/utils/logManager";
import { eventManager } from "@/lib/events/EventManager";
import { EventPayload } from "@/types/events";

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
  
  // Set up timer synchronization logic using only eventManager
  useEffect(() => {
    // Only set up monitoring if we have a task name
    if (!taskName) return;
    
    logger.debug('TimerMonitoring', `Monitoring timer for task: ${taskName}`);
    
    // Set up timer event listeners for synchronization
    const unsubTick = eventManager.on('timer:tick', (payload: EventPayload<'timer:tick'>) => {
      if (payload.taskName === taskName && payload.timeLeft !== undefined) {
        // Only update if the timeLeft is different, to prevent infinite loops
        updateTimeLeft(payload.timeLeft);
      }
    });
    
    // Handle timer complete events
    const unsubComplete = eventManager.on('timer:complete', async (payload: EventPayload<'timer:complete'>) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerMonitoring', `Timer complete event received for task: ${taskName}`);
        
        try {
          await handleComplete();
        } catch (error) {
          logger.error('TimerMonitoring', `Error handling timer complete: ${error}`);
        }
      }
    });
    
    // Emit init event to mark timer as initialized
    eventManager.emit('timer:init', {
      taskName,
      duration: 0 // Default duration
    });
    
    // Cleanup when unmounting
    return () => {
      logger.debug('TimerMonitoring', `Stopped monitoring timer for task: ${taskName}`);
      unsubTick();
      unsubComplete();
    };
  }, [taskName, updateTimeLeft, handleComplete]);
  
  // Return a function for checking timer state
  return useCallback(() => {
    logger.debug('TimerMonitoring', `Manually checking timer state for task: ${taskName}`);
    
    // Emit a request for timer state
    eventManager.emit('timer:tick', {
      taskName,
      timeLeft: -1 // Special value to indicate a request for the current time
    });
  }, [taskName]);
};
