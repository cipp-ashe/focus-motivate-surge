
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";

interface UseAutoCompleteProps {
  isRunning: boolean;
  pause: () => void;
  playSound: () => void;
  metrics: TimerStateMetrics;
  completeTimer: () => Promise<void>;
  onComplete?: (metrics: TimerStateMetrics) => void;
  taskName: string;
  setCompletionMetrics: (metrics: any) => void;
  setShowCompletion: (show: boolean) => void;
}

export const useAutoComplete = ({
  isRunning,
  pause,
  playSound,
  metrics,
  completeTimer,
  onComplete,
  taskName,
  setCompletionMetrics,
  setShowCompletion
}: UseAutoCompleteProps): (() => Promise<void>) => {
  // Return a direct function that returns a Promise<void>
  return useCallback(async (): Promise<void> => {
    if (isRunning) {
      pause();
    }
    
    playSound();
    
    const completionMetrics: TimerStateMetrics = {
      ...metrics,
      completionStatus: "Completed On Time"
    };
    
    try {
      // Await the Promise from completeTimer
      await completeTimer();
      
      setCompletionMetrics(completionMetrics);
      setShowCompletion(true);
      
      if (onComplete) {
        onComplete(completionMetrics);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error completing timer:", error);
      return Promise.reject(error);
    }
  }, [isRunning, pause, playSound, metrics, completeTimer, onComplete, taskName, setCompletionMetrics, setShowCompletion]);
};
