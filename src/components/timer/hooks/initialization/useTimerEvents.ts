
import { useEffect } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { logger } from "@/utils/logManager";

export const useTimerEvents = (taskName: string, duration: number) => {
  // Emit an initialization event when the component mounts
  useEffect(() => {
    logger.debug('TimerInitialization', `Initializing timer for task: ${taskName} with duration: ${duration}`);
    eventManager.emit('timer:init', {
      taskName,
      duration
    });
    
    // Clean up on unmount
    return () => {
      logger.debug('TimerInitialization', `Cleaning up timer for task: ${taskName}`);
    };
  }, [taskName, duration]);
};
