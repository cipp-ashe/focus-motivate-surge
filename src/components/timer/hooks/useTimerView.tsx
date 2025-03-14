
import { useMemo } from "react";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerViewProps {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  metrics: TimerStateMetrics;
  isExpanded: boolean;
  handleTimerToggle: () => void;
  handleComplete: () => Promise<void>; // Ensure this is Promise<void>
  handleAddTime: (minutes: number) => void;
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
  const getTimerCircleProps = useMemo(
    () => () => ({
      isRunning,
      timeLeft,
      minutes,
      circumference: 283,
      onClick: handleTimerToggle,
    }),
    [isRunning, timeLeft, minutes, handleTimerToggle]
  );

  const getTimerControlsProps = useMemo(
    () => (size: 'normal' | 'large' = 'normal') => ({
      isRunning,
      onToggle: handleTimerToggle,
      onComplete: (): Promise<void> => {
        // Return the Promise from handleComplete
        return handleComplete();
      },
      onAddTime: handleAddTime,
      showAddTime: true,
      size,
      metrics,
      pauseTimeLeft,
    }),
    [isRunning, handleTimerToggle, handleComplete, handleAddTime, metrics, pauseTimeLeft]
  );

  return {
    getTimerCircleProps,
    getTimerControlsProps,
  };
};
