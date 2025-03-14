
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
        taskName, 
        timeLeft,
        metrics 
      });
    } else {
      // If timer is not running, start it
      start();
      
      // Determine if this is a resume or a fresh start
      if (metrics.isPaused) {
        // Resume from pause - emit resume event
        console.log(`Resuming timer for ${taskName} with time left: ${timeLeft}`);
        
        // Update metrics to indicate no longer paused
        updateMetrics({
          isPaused: false,
          pausedTimeLeft: null
        });
        
        eventManager.emit('timer:resume', { 
          taskName, 
          timeLeft,
          currentTime: Date.now()
        });
      } else {
        // Fresh start - emit start event
        console.log(`Starting fresh timer for ${taskName} with duration: ${timeLeft}`);
        eventManager.emit('timer:start', { 
          taskName, 
          duration: timeLeft,
          currentTime: Date.now()
        });
      }
    }
  }, [isRunning, pause, start, taskName, timeLeft, metrics, updateMetrics]);

  return handleToggle;
};
