
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";
import { logger } from "@/utils/logManager";

/**
 * Hook for handling timer completion
 */
export const useTimerComplete = ({ 
  taskName, 
  metrics, 
  setIsExpanded, 
  onComplete 
}: {
  taskName: string;
  metrics: TimerStateMetrics;
  setIsExpanded: (expanded: boolean) => void;
  onComplete: ((metrics: TimerStateMetrics) => void) | undefined;
}) => {
  // Handle timer completion
  const completeTimer = useCallback(async (): Promise<void> => {
    try {
      // Ensure metrics has a completionDate as a string
      const finalMetrics = {
        ...metrics,
        // Always ensure there's a completionDate string
        completionDate: new Date().toISOString(),
        // Make sure we have an endTime - keep as Date object for calculations
        endTime: metrics.endTime || new Date()
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

  return { completeTimer };
};
