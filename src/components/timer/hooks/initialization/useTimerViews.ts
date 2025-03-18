import { useCallback } from "react";
import { useTimerView } from "../useTimerView";
import { useAutoComplete } from "../useAutoComplete";
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
    getTimerCircleProps,
    getTimerControlsProps
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
}: UseAutoCompleteProps) => {
  return useCallback(async (): Promise<void> => {
    if (isRunning) {
      pause();
    }
    
    try {
      await completeTimer();
      return Promise.resolve();
    } catch (error) {
      console.error("Error in autoComplete:", error);
      return Promise.reject(error);
    }
  }, [isRunning, pause, completeTimer]);
};
