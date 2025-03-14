
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerPauseResumeProps {
  taskName: string;
  timeLeft: number;
  metrics: TimerStateMetrics;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  pause: () => void;
  start: () => void;
  setPauseTimeLeft: (timeLeft: number | null) => void;
}

export const useTimerPauseResume = ({
  taskName,
  timeLeft,
  metrics,
  updateMetrics,
  pause,
  start,
  setPauseTimeLeft,
}: UseTimerPauseResumeProps) => {
  // Handle pause timer
  const handlePause = useCallback(() => {
    console.log(`Pausing timer for ${taskName} with time left: ${timeLeft}`);
    
    // Get current state for later resume
    setPauseTimeLeft(timeLeft);
    
    // Store pause timestamp
    updateMetrics({
      lastPauseTimestamp: new Date(),
      pauseCount: metrics.pauseCount + 1,
      isPaused: true,
      pausedTimeLeft: timeLeft
    });
    
    // Actually pause the timer
    pause();
    
    // Emit pause event
    eventManager.emit('timer:pause', {
      taskName,
      timeLeft,
      metrics
    });
  }, [pause, setPauseTimeLeft, metrics, updateMetrics, taskName, timeLeft]);

  // Adding a resume handler for more explicit control
  const handleResume = useCallback(() => {
    console.log(`Resuming timer for ${taskName} with time left: ${timeLeft}`);
    
    // Update metrics to indicate timer is no longer paused
    updateMetrics({
      isPaused: false,
      pausedTimeLeft: null
    });
    
    // Start the timer
    start();
    
    // Emit resume event
    eventManager.emit('timer:resume', {
      taskName,
      timeLeft,
      metrics
    });
  }, [start, updateMetrics, taskName, timeLeft, metrics]);

  return {
    handlePause,
    handleResume,
  };
};
