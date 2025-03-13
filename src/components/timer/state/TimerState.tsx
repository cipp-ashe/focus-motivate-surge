
import { useCallback } from "react";
import { eventBus } from "@/lib/eventBus";

// This function completes the timer and ensures proper cleanup
export const useTimerComplete = ({ 
  taskName, 
  metrics, 
  setIsExpanded, 
  onComplete 
}: { 
  taskName: string; 
  metrics: any; 
  setIsExpanded: (expanded: boolean) => void; 
  onComplete?: (metrics: any) => void;
}) => {
  
  const completeTimer = useCallback(async () => {
    // Emit the timer:complete event to notify other components
    eventBus.emit('timer:complete', { 
      taskName, 
      metrics 
    });
    
    // Ensure we collapse the timer after completion
    setIsExpanded(false);
    
    // Call the onComplete callback if provided
    if (onComplete) onComplete(metrics);
  }, [taskName, metrics, onComplete, setIsExpanded]);

  return { completeTimer };
};
