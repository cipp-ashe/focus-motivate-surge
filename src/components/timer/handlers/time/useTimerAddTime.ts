import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";

interface UseTimerAddTimeProps {
  addTime: (minutes: number) => void;
  onAddTime?: (minutes: number) => void;
  taskName: string;
  metrics: TimerStateMetrics;
  timeLeft: number;
  isRunning: boolean;
}

export const useTimerAddTime = ({
  addTime,
  onAddTime,
  taskName,
  metrics,
  timeLeft,
  isRunning,
}: UseTimerAddTimeProps) => {
  const handleAddTime = useCallback(
    (minutes: number = TIMER_CONSTANTS.ADD_TIME_MINUTES) => {
      console.log(`Adding ${minutes} minutes to timer`);
      
      addTime(minutes);
      
      // Calculate new timeLeft after adding minutes
      const newTimeLeft = timeLeft + (minutes * 60);
      
      // Emit event to update the timer with new time
      if (isRunning) {
        eventManager.emit('timer:tick', {
          taskName,
          remaining: newTimeLeft,
          timeLeft: newTimeLeft
        });
      }
      
      // Call onAddTime callback if provided
      if (onAddTime) {
        onAddTime(minutes);
      }
      
      // Updated to use the correct event type
      eventManager.emit('timer:metrics-update', {
        taskName,
        metrics: {
          ...metrics,
          extensionTime: (metrics.extensionTime || 0) + (minutes * 60)
        }
      });
    },
    [addTime, onAddTime, taskName, metrics, timeLeft, isRunning]
  );

  return handleAddTime;
};
