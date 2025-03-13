
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";

interface UseTimerViewProps {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  metrics: TimerStateMetrics;
  isExpanded: boolean;
  handleTimerToggle: () => void;
  handleComplete: () => void;
  handleAddTime: (minutes: number) => void;  // Update signature to accept minutes parameter
  pauseTimeLeft: number | null;
}

export const useTimerView = ({
  isRunning,
  timeLeft,
  minutes,
  metrics,
  isExpanded,
  handleTimerToggle,
  handleComplete,
  handleAddTime,
  pauseTimeLeft,
}: UseTimerViewProps) => {
  const getTimerCircleProps = useCallback(() => ({
    isRunning,
    timeLeft,
    minutes,
    circumference: TIMER_CONSTANTS.CIRCLE_CIRCUMFERENCE,
  }), [isRunning, timeLeft, minutes]);

  const getTimerControlsProps = useCallback((size: 'normal' | 'large' = 'normal') => ({
    isRunning,
    onToggle: handleTimerToggle,
    isPaused: metrics.isPaused,
    onComplete: handleComplete,
    onAddTime: handleAddTime,  // This now passes through the function with its parameters
    metrics,
    showAddTime: isExpanded,
    pauseTimeLeft,
    size,
  }), [isRunning, handleTimerToggle, metrics, handleComplete, handleAddTime, isExpanded, pauseTimeLeft]);

  return {
    getTimerCircleProps,
    getTimerControlsProps,
  };
};
