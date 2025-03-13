
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
    // Ensure metrics has a completionDate if missing
    const finalMetrics = {
      ...metrics,
      // Ensure there's a completionDate string for storage compatibility
      completionDate: metrics.completionDate || new Date().toISOString(),
      // Make sure we have an endTime
      endTime: metrics.endTime || new Date()
    };
    
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
  }, [taskName, metrics, onComplete, setIsExpanded]);

  return { completeTimer };
};
