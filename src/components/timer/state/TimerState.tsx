
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";

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
        // Always ensure there's a completionDate string
        completionDate: typeof metrics.completionDate === 'string' 
          ? metrics.completionDate 
          : new Date().toISOString(),
        // Make sure we have an endTime
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
        completionDate: new Date().toISOString(),
        endTime: new Date()
      };
    }
  }, [taskName, metrics, onComplete, setIsExpanded]);

  return { completeTimer };
};
