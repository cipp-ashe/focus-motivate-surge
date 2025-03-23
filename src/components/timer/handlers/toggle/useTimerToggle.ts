
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerToggleProps {
  taskName: string;
  isRunning: boolean;
  timeLeft: number;
  metrics: TimerStateMetrics;
  updateMetrics: (metrics: Partial<TimerStateMetrics>) => void;
  pause: () => void;
  start: () => void;
}

export const useTimerToggle = ({
  taskName,
  isRunning,
  timeLeft,
  metrics,
  updateMetrics,
  pause,
  start,
}: UseTimerToggleProps) => {
  const handleToggle = useCallback(() => {
    console.log(`Toggle timer for ${taskName}. Current state: isRunning=${isRunning}, isPaused=${metrics.isPaused}, timeLeft=${timeLeft}`);
    
    if (isRunning) {
      // If timer is running, pause it
      pause();
      
      // Update metrics to track pause state
      updateMetrics({
        lastPauseTimestamp: new Date(),
        pauseCount: metrics.pauseCount + 1,
        isPaused: true,
        pausedTimeLeft: timeLeft
      });
      
      // Emit pause event with current time left
      eventManager.emit('timer:pause', { 
        taskId: metrics.taskId || undefined,
        taskName, 
        timeLeft
      });
      console.log(`Timer paused for ${taskName} with ${timeLeft} seconds remaining`);
    } else {
      // If timer is not running, start it
      start();
      
      // Determine if this is a resume or a fresh start
      if (metrics.isPaused) {
        // Resume from pause
        console.log(`Resuming timer for ${taskName} with time left: ${timeLeft}`);
        
        // Update metrics to indicate no longer paused
        updateMetrics({
          isPaused: false,
          pausedTimeLeft: null
        });
        
        eventManager.emit('timer:resume', { 
          taskId: metrics.taskId || undefined,
          taskName, 
          timeLeft
        });
      } else {
        // Fresh start
        console.log(`Starting fresh timer for ${taskName} with duration: ${timeLeft}`);
        
        // Make sure to set startTime in metrics for a fresh start
        updateMetrics({
          startTime: new Date(),
          isPaused: false
        });
        
        eventManager.emit('timer:start', { 
          taskId: metrics.taskId || undefined,
          taskName, 
          duration: timeLeft
        });
      }
    }
  }, [isRunning, pause, start, taskName, timeLeft, metrics, updateMetrics]);

  return handleToggle;
};
