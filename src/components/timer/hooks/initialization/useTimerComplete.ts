
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";
import { logger } from "@/utils/logManager";
import { toISOString } from "@/lib/utils/dateUtils";

interface UseTimerCompleteProps {
  taskName: string;
  metrics: TimerStateMetrics;
  setIsExpanded: (expanded: boolean) => void;
  onComplete: ((metrics: TimerStateMetrics) => void) | undefined;
}

/**
 * Hook for handling timer completion
 * Returns a function that returns Promise<void>
 */
export const useTimerComplete = ({ 
  taskName, 
  metrics, 
  setIsExpanded, 
  onComplete 
}: UseTimerCompleteProps): (() => Promise<void>) => {
  // Return a function that returns a Promise<void> directly
  const completeTimerFn = useCallback(async (): Promise<void> => {
    try {
      // Convert dates to ISO strings for serialization
      const finalMetrics = {
        ...metrics,
        // Ensure we have properly formatted dates as strings
        startTime: metrics.startTime ? 
          (typeof metrics.startTime === 'string' ? metrics.startTime : toISOString(metrics.startTime)) : 
          toISOString(new Date()),
        endTime: metrics.endTime ? 
          (typeof metrics.endTime === 'string' ? metrics.endTime : toISOString(metrics.endTime)) : 
          toISOString(new Date()),
        completionDate: metrics.completionDate || toISOString(new Date()),
        lastPauseTimestamp: metrics.lastPauseTimestamp ? 
          (typeof metrics.lastPauseTimestamp === 'string' ? metrics.lastPauseTimestamp : toISOString(metrics.lastPauseTimestamp)) :
          null
      };
      
      logger.debug("TimerComplete", "Completing timer with metrics:", finalMetrics);
      
      // Close expanded view if open
      setIsExpanded(false);
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(finalMetrics);
      }
      
      // Emit completion event
      eventManager.emit('timer:complete', { 
        taskName, 
        metrics: finalMetrics 
      });
      
      // Return void explicitly through Promise.resolve()
      return Promise.resolve();
    } catch (error) {
      logger.error("TimerComplete", "Error in completeTimer:", error);
      // Return rejected promise in case of error
      return Promise.reject(error);
    }
  }, [taskName, metrics, onComplete, setIsExpanded]);
  
  return completeTimerFn;
};
