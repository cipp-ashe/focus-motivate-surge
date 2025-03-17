
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
    
    // Store pause timestamp for calculating paused time
    updateMetrics({
      lastPauseTimestamp: new Date(),
      pauseCount: metrics.pauseCount + 1,
      isPaused: true,
      pausedTimeLeft: timeLeft
    });
    
    // Actually pause the timer
    pause();
    
    // Emit pause event with correct payload structure
    eventManager.emit('timer:pause', {
      taskName,
      timeLeft
    });
  }, [pause, setPauseTimeLeft, metrics, updateMetrics, taskName, timeLeft]);

  // Adding a resume handler for more explicit control
  const handleResume = useCallback(() => {
    console.log(`Resuming timer for ${taskName} with time left: ${timeLeft}`);
    
    // Calculate pause duration if we have a lastPauseTimestamp
    let pausedTime = metrics.pausedTime || 0;
    if (metrics.lastPauseTimestamp) {
      const now = new Date();
      const pauseDuration = Math.floor(
        (now.getTime() - metrics.lastPauseTimestamp.getTime()) / 1000
      );
      pausedTime += pauseDuration;
      console.log(`Added ${pauseDuration}s to paused time, total: ${pausedTime}s`);
    }
    
    // Update metrics to indicate timer is no longer paused
    updateMetrics({
      isPaused: false,
      pausedTimeLeft: null,
      lastPauseTimestamp: null,
      pausedTime: pausedTime
    });
    
    // Start the timer
    start();
    
    // Emit resume event with correct payload structure
    eventManager.emit('timer:resume', {
      taskName,
      timeLeft
    });
  }, [start, updateMetrics, taskName, timeLeft, metrics]);

  return {
    handlePause,
    handleResume,
  };
};
