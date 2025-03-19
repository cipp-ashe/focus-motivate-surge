
import { useEffect } from "react";
import { logger } from "@/utils/logManager";

interface UseTimerMonitoringProps {
  taskName: string;
  updateTimeLeft: (timeLeft: number) => void;
  handleComplete: () => Promise<void>;
}

/**
 * Hook for monitoring timer behavior and handling timer completion
 * Returns a function that can be called to manually complete the timer
 */
export const useTimerMonitoring = ({
  taskName,
  updateTimeLeft,
  handleComplete,
}: UseTimerMonitoringProps): (() => Promise<void>) => {
  // Log timer information on mount
  useEffect(() => {
    logger.debug("TimerMonitoring", `Monitoring timer for task: ${taskName}`);
    
    return () => {
      logger.debug("TimerMonitoring", `Stopped monitoring timer for task: ${taskName}`);
    };
  }, [taskName]);

  // Handle timeLeft reaching zero
  useEffect(() => {
    // This effect is intentionally empty as the completion is handled by
    // the useTimerCore component's time-up logic
    
    // Just return cleanup function
    return () => {};
  }, []);

  // Return the handleComplete function directly
  return handleComplete;
};
