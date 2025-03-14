
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerResetProps {
  reset: () => Promise<void>;
  setShowConfirmation: (show: boolean) => void;
  taskName: string;
  metrics: TimerStateMetrics;
}

export const useTimerReset = ({
  reset,
  setShowConfirmation,
  taskName,
  metrics,
}: UseTimerResetProps) => {
  // Handle timer reset
  const handleReset = useCallback(async () => {
    await reset();
    setShowConfirmation(false);
    
    // Emit reset event
    eventManager.emit('timer:reset', {
      taskName,
      duration: metrics.expectedTime
    });
    
    // Also emit init event to ensure timer is properly reset
    eventManager.emit('timer:init', {
      taskName,
      duration: metrics.expectedTime
    });
  }, [reset, setShowConfirmation, taskName, metrics.expectedTime]);

  // Handle confirmation dialog
  const showResetConfirmation = useCallback(() => {
    setShowConfirmation(true);
  }, [setShowConfirmation]);

  return {
    handleReset,
    showResetConfirmation,
  };
};
