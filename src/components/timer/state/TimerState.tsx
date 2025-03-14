import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";
import { toISOString, getCurrentISOString } from "@/lib/utils/dateUtils";

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
  onComplete: (metrics: TimerStateMetrics) => void;
}) => {
  // Handle timer completion
  const completeTimer = useCallback(() => {
    try {
      // Ensure metrics has a completionDate as a string
      const finalMetrics = {
        ...metrics,
        // Always ensure there's a completionDate string using our utility
        completionDate: toISOString(metrics.completionDate || new Date()),
        // Make sure we have an endTime - keep as Date object for calculations
        endTime: metrics.endTime || new Date()
      };
      
      console.log("TimerState: Completing timer with metrics:", finalMetrics);
      
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
      
      return finalMetrics;
    } catch (error) {
      console.error("Error in completeTimer:", error);
      // Return basic metrics to prevent crashes
      return {
        ...metrics,
        completionDate: getCurrentISOString(),
        endTime: new Date()
      };
    }
  }, [taskName, metrics, onComplete, setIsExpanded]);

  return { completeTimer };
};
