
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
