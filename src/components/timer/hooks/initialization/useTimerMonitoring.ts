
import { useTimerMonitor } from "@/hooks/useTimerMonitor";
import { logger } from "@/utils/logManager";
import { eventManager } from "@/lib/events/EventManager";

interface UseTimerMonitoringProps {
  taskName: string;
  updateTimeLeft: (seconds: number) => void;
  handleComplete: () => void;
}

export const useTimerMonitoring = ({
  taskName,
  updateTimeLeft,
  handleComplete
}: UseTimerMonitoringProps) => {
  // Monitor timer state
  useTimerMonitor({
    onTick: (seconds) => {
      logger.debug('TimerMonitor', `Timer tick: ${seconds}s remaining for ${taskName}`);
      updateTimeLeft(seconds);
      
      // Emit tick event
      eventManager.emit('timer:tick', {
        taskName,
        remaining: seconds,
        timeLeft: seconds
      });
    },
    onComplete: () => {
      logger.debug('TimerMonitor', `Timer complete for ${taskName}`);
      handleComplete();
    },
    onStart: (task, duration) => {
      logger.debug('TimerMonitor', `Timer started for ${task} with duration ${duration}`);
    },
    onPause: () => {
      logger.debug('TimerMonitor', `Timer paused for ${taskName}`);
    },
    onResume: () => {
      logger.debug('TimerMonitor', `Timer resumed for ${taskName}`);
    }
  });
};
