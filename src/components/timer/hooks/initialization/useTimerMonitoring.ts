
import { useEffect } from "react";
import { logger } from "@/utils/logManager";

interface UseTimerMonitoringProps {
  taskName: string;
  updateTimeLeft: (timeLeft: number) => void;
  handleComplete: () => Promise<void>; // This should return Promise<void>
}

/**
 * Hook for monitoring timer behavior and handling timer completion
 */
export const useTimerMonitoring = ({
  taskName,
  updateTimeLeft,
  handleComplete,
}: UseTimerMonitoringProps) => {
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

  // Return a function, not an object with a function property
  return async (): Promise<void> => {
    logger.debug("TimerMonitoring", `Timer completed for task: ${taskName}`);
    // Call the provided handleComplete function and ensure it returns a Promise
    return handleComplete();
  };
};
