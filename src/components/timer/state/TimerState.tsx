
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
    // Close expanded view if open
    setIsExpanded(false);
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(metrics);
    }
    
    // Emit completion event
    eventManager.emit('timer:complete', { 
      taskName, 
      metrics 
    });
    
    return metrics;
  }, [taskName, metrics, onComplete, setIsExpanded]);

  return { completeTimer };
};
