
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";
import { toISOString } from "@/lib/utils/dateUtils";

interface UseTimerCompleteProps {
  isRunning: boolean;
  pause: () => void;
  playSound: () => void;
  setCompletionMetrics: (metrics: any) => void;
  setShowCompletion: (show: boolean) => void;
  setIsExpanded: (expanded: boolean) => void;
  completeTimer: () => Promise<void>;
  onComplete?: (metrics: TimerStateMetrics) => void;
  metrics: TimerStateMetrics;
  taskName: string;
}

export const useTimerComplete = ({
  isRunning,
  pause,
  playSound,
  setCompletionMetrics,
  setShowCompletion,
  setIsExpanded,
  completeTimer,
  onComplete,
  metrics,
  taskName,
}: UseTimerCompleteProps) => {
  // Handle timer completion
  const handleComplete = useCallback(async (): Promise<void> => {
    try {
      console.log("TimerHandlers: Starting timer completion process");
      
      // If timer is running, pause it first
      if (isRunning) {
        pause();
      }
      
      // Ensure we have a valid start time - convert to ISO string for proper serialization
      const startTime = metrics.startTime ? 
        (typeof metrics.startTime === 'string' ? metrics.startTime : toISOString(metrics.startTime)) 
        : toISOString(new Date(Date.now() - 1500 * 1000)); // Default to 25 minutes ago
      
      // Calculate end time
      const endTime = toISOString(new Date());
      
      // Calculate actual duration if we have a start time
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const actualDuration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
      
      // Calculate final metrics
      const netEffectiveTime = actualDuration - (metrics.pausedTime || 0) + (metrics.extensionTime || 0);
      
      // Determine completion status based on expected vs actual time
      let completionStatus: "Completed Early" | "Completed On Time" | "Completed Late" | "Completed Very Early" | "Completed Very Late" = "Completed On Time";
      if (netEffectiveTime < metrics.expectedTime * 0.8) {
        completionStatus = "Completed Early";
      } else if (netEffectiveTime > metrics.expectedTime * 1.2) {
        completionStatus = "Completed Late";
      }
      
      // Calculate efficiency ratio
      const efficiencyRatio = metrics.expectedTime > 0 ? 
        Math.round((netEffectiveTime / metrics.expectedTime) * 100) / 100 : 0;
      
      // Compile complete metrics
      const completeMetrics: TimerStateMetrics = {
        ...metrics,
        startTime,
        endTime,
        actualDuration,
        pausedTime: metrics.pausedTime || 0,
        extensionTime: metrics.extensionTime || 0,
        netEffectiveTime,
        efficiencyRatio,
        completionStatus,
        isPaused: false,
        pausedTimeLeft: null,
        completionDate: endTime
      };
      
      console.log("TimerHandlers: Calculated completion metrics:", completeMetrics);
      
      // Set the completion metrics for the UI
      setCompletionMetrics(completeMetrics);
      
      // Show the completion view
      setShowCompletion(true);
      
      // Expand the timer view to show completion details
      setIsExpanded(true);
      
      // Play sound to indicate completion
      setTimeout(() => {
        playSound();
      }, 300);
      
      // Emit completion event
      eventManager.emit('timer:complete', { 
        taskName, 
        metrics: completeMetrics 
      });
      
      // Call completion callback if provided
      if (onComplete) {
        console.log("TimerHandlers: Calling onComplete with metrics:", completeMetrics);
        onComplete(completeMetrics);
      }
      
      // Complete timer in state
      await completeTimer();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error during timer completion:", error);
      return Promise.reject(error);
    }
  }, [
    isRunning,
    pause,
    metrics,
    setCompletionMetrics,
    setShowCompletion,
    setIsExpanded,
    completeTimer,
    onComplete,
    playSound,
    taskName
  ]);

  return {
    handleComplete
  };
};
