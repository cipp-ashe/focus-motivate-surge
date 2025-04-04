
import { useCallback } from 'react';
import { TimerStateMetrics } from '@/types/metrics';
import { TIMER_CONSTANTS } from '@/types/timer/constants';

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
  // Log the TIMER_CONSTANTS to check if it exists
  console.log("TIMER_CONSTANTS in useTimerControls:", TIMER_CONSTANTS);
  
  const handleToggle = useCallback(() => {
    if (isRunning) {
      console.log("useTimerControls: Pausing timer");
      onPause();
    } else {
      console.log("useTimerControls: Starting timer");
      onStart();
    }
  }, [isRunning, onPause, onStart]);

  // Return a Promise here too
  const handleComplete = useCallback(async (): Promise<void> => {
    console.log("useTimerControls: Completing timer");
    return onComplete();
  }, [onComplete]);

  // Consistently accepts a minutes parameter with default value
  const handleAddTime = useCallback((minutes: number = TIMER_CONSTANTS.ADD_TIME_MINUTES) => {
    console.log(`useTimerControls: Adding ${minutes} minutes to timer`);
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
    isPaused: !isRunning && metrics.startTime !== null && metrics.isPaused === true,
  };
};
