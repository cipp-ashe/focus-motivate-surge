
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerViewProps {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  metrics: TimerStateMetrics;
  isExpanded: boolean;
  pauseTimeLeft?: number | null;
  handleTimerToggle: () => void;
  handleComplete: () => Promise<void>; // Ensure Promise<void> return type
  handleAddTime: (minutes: number) => void;
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
  const getTimerCircleProps = useCallback(() => {
    const circumference = 2 * Math.PI * 45;
    const isPaused = metrics.isPaused || false;
    
    return {
      isRunning,
      isPaused,
      timeLeft: isPaused && pauseTimeLeft ? pauseTimeLeft : timeLeft,
      minutes,
      circumference,
      size: isExpanded ? 'large' : 'normal',
      onClick: handleTimerToggle,
      a11yProps: {
        "aria-label": isRunning ? "Pause timer" : isPaused ? "Resume timer" : "Start timer",
        "aria-live": "polite",
        "aria-valuemax": minutes * 60,
        "aria-valuenow": timeLeft,
        role: "timer",
      },
    };
  }, [isRunning, timeLeft, minutes, isExpanded, handleTimerToggle, metrics, pauseTimeLeft]);

  const getTimerControlsProps = useCallback(
    (size: 'normal' | 'large' = 'normal') => {
      const isPaused = metrics.isPaused || false;
      
      return {
        isRunning,
        isPaused,
        onToggle: handleTimerToggle,
        // Explicitly pass the Promise<void> function
        onComplete: handleComplete,
        onAddTime: handleAddTime,
        size,
        showAddTime: !isExpanded,
        metrics,
        pauseTimeLeft,
        toggleButtonA11yProps: {
          "aria-label": isRunning ? "Pause timer" : isPaused ? "Resume timer" : "Start timer",
          "aria-pressed": isRunning,
        },
        completeButtonA11yProps: {
          "aria-label": "Complete timer",
        },
      };
    },
    [
      isRunning,
      handleTimerToggle,
      handleComplete,
      handleAddTime,
      isExpanded,
      metrics,
      pauseTimeLeft,
    ]
  );

  return {
    getTimerCircleProps,
    getTimerControlsProps,
  };
};
