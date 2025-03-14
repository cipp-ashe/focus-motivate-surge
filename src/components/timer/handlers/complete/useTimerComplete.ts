
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";

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
  const handleComplete = useCallback(async () => {
    try {
      console.log("TimerHandlers: Starting timer completion process");
      
      // If timer is running, pause it first
      if (isRunning) {
        pause();
      }
      
      // Ensure we have a valid start time
      const startTime = metrics.startTime || new Date(Date.now() - (metrics.expectedTime * 1000));
      const now = new Date();
      
      // Calculate actual duration in seconds
      const actualDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      
      // Calculate effective working time (accounting for pauses)
      const pausedTime = metrics.pausedTime || 0;
      const extensionTime = metrics.extensionTime || 0;
      const netEffectiveTime = Math.max(0, actualDuration - pausedTime + extensionTime);
      
      // Update metrics with completion information
      const calculatedMetrics = {
        ...metrics,
        startTime,
        endTime: now,
        // Ensure completionDate is a string
        completionDate: now.toISOString(),
        actualDuration: actualDuration,
        netEffectiveTime: netEffectiveTime,
        // Ensure we have valid fields for completed timer
        isPaused: false,
        pausedTimeLeft: null
      };
      
      console.log("TimerHandlers: Calculated completion metrics:", calculatedMetrics);
      
      // Play completion sound
      playSound();
      
      // Update metrics state
      setCompletionMetrics(calculatedMetrics);
      
      // Show completion screen
      setShowCompletion(true);
      
      // Close expanded view if open
      setIsExpanded(false);
      
      // Complete the timer
      await completeTimer();
      
      // Call the onComplete callback if provided
      if (onComplete) {
        try {
          console.log("TimerHandlers: Calling onComplete with metrics:", calculatedMetrics);
          onComplete(calculatedMetrics);
        } catch (callbackError) {
          console.error("Error in onComplete callback:", callbackError);
        }
      }
      
      // Emit completion event for integration with other components
      eventManager.emit('timer:complete', { 
        taskName, 
        metrics: calculatedMetrics 
      });
      
      console.log("Timer completed with metrics:", calculatedMetrics);
      
    } catch (error) {
      console.error("Error completing timer:", error);
      // Even in case of error, try to show completion
      setShowCompletion(true);
    }
  }, [
    isRunning,
    pause,
    metrics,
    playSound,
    setCompletionMetrics,
    onComplete,
    setShowCompletion,
    setIsExpanded,
    completeTimer,
    taskName,
  ]);

  return handleComplete;
};
