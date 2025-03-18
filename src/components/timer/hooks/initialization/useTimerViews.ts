
import { useCallback } from "react";
import { useTimerView } from "../useTimerView";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerViewsProps {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  metrics: TimerStateMetrics;
  isExpanded: boolean;
  pauseTimeLeft: number | null;
  handleToggle: () => void;
  handleComplete: () => Promise<void>;
  handleAddTime: (minutes: number) => void;
}

export const useTimerViews = ({
  isRunning,
  timeLeft,
  minutes,
  metrics,
  isExpanded,
  pauseTimeLeft,
  handleToggle,
  handleComplete,
  handleAddTime
}: UseTimerViewsProps) => {
  // Use the timerview hook to generate props for timer components
  const { getTimerCircleProps, getTimerControlsProps } = useTimerView({
    isRunning,
    timeLeft,
    minutes,
    metrics,
    isExpanded,
    handleTimerToggle: handleToggle,
    handleComplete,
    handleAddTime,
    pauseTimeLeft
  });

  return {
    getTimerCircleProps: useCallback(() => getTimerCircleProps(), [getTimerCircleProps]),
    getTimerControlsProps: useCallback(() => getTimerControlsProps(), [getTimerControlsProps])
  };
};

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

export const useTimerAutoComplete = ({
  isRunning,
  pause,
  playSound,
  metrics,
  completeTimer,
  onComplete,
  taskName,
  setCompletionMetrics,
  setShowCompletion
}: UseAutoCompleteProps): () => Promise<void> => {
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
