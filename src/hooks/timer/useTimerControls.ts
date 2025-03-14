
import { useCallback } from 'react';
import { TimerStateMetrics } from '@/types/metrics';
import { TIMER_CONSTANTS } from '@/types/timer';

interface UseTimerControlsParams {
  timeLeft: number;
  isRunning: boolean;
  metrics: TimerStateMetrics;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => Promise<void>;  // Make sure this returns Promise<void>
  onAddTime?: (minutes: number) => void;
}

export const useTimerControls = ({
  timeLeft,
  isRunning,
  metrics,
  onStart,
  onPause,
  onComplete,
  onAddTime,
}: UseTimerControlsParams) => {
  const handleToggle = useCallback(() => {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  }, [isRunning, onPause, onStart]);

  // Return a Promise here too
  const handleComplete = useCallback(async (): Promise<void> => {
    return onComplete();
  }, [onComplete]);

  // Consistently accepts a minutes parameter with default value
  const handleAddTime = useCallback((minutes: number = TIMER_CONSTANTS.ADD_TIME_MINUTES) => {
    if (onAddTime) {
      onAddTime(minutes);
    }
  }, [onAddTime]);

  const showAddTimeButton = timeLeft < TIMER_CONSTANTS.ADD_TIME_MINUTES * 60;

  return {
    handleToggle,
    handleComplete,
    handleAddTime,
    showAddTimeButton,
    isPaused: !isRunning && metrics.startTime !== null,
  };
};
