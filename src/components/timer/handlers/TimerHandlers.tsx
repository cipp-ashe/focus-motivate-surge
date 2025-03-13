
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";

interface TimerHandlersProps {
  taskName: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => Promise<void>;
  addTime: (minutes: number) => void;
  completeTimer: () => Promise<void>;
  playSound: () => void;
  onAddTime?: (minutes: number) => void;
  onComplete?: (metrics: TimerStateMetrics) => void;
  setShowConfirmation: (show: boolean) => void;
  setCompletionMetrics: (metrics: any) => void;
  setShowCompletion: (show: boolean) => void;
  setIsExpanded: (expanded: boolean) => void;
  metrics: TimerStateMetrics;
  updateMetrics: (metrics: Partial<TimerStateMetrics>) => void;
  setPauseTimeLeft: (timeLeft: number | null) => void;
  pauseTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  timeLeft: number;
}

export const useTimerHandlers = ({
  taskName,
  isRunning,
  start,
  pause,
  reset,
  addTime,
  completeTimer,
  playSound,
  onAddTime,
  onComplete,
  setShowConfirmation,
  setCompletionMetrics,
  setShowCompletion,
  setIsExpanded,
  metrics,
  updateMetrics,
  setPauseTimeLeft,
  pauseTimerRef,
  timeLeft,
}: TimerHandlersProps) => {
  // Handle toggle button click
  const handleToggle = useCallback(() => {
    console.log(`Toggle timer for ${taskName}. Current state: isRunning=${isRunning}, timeLeft=${timeLeft}`);
    
    if (isRunning) {
      pause();
      // Emit pause event with current time left
      eventManager.emit('timer:pause', { 
        taskName, 
        timeLeft,
        metrics 
      });
    } else {
      start();
      // Determine if this is a resume or a fresh start
      if (metrics.isPaused) {
        // Resume from pause - emit resume event
        console.log(`Resuming timer for ${taskName} with time left: ${timeLeft}`);
        eventManager.emit('timer:resume', { 
          taskName, 
          timeLeft,
          currentTime: Date.now()
        });
        // Update metrics to indicate no longer paused
        updateMetrics({
          isPaused: false
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

  // Handle add time button click - explicitly accepting minutes parameter
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
      
      // Emit event for adding time
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

  // Handle timer completion
  const handleComplete = useCallback(async () => {
    try {
      // If timer is running, pause it first
      if (isRunning) {
        pause();
      }
      
      // Ensure we have a valid start time
      const startTime = metrics.startTime || new Date(Date.now() - (metrics.expectedTime * 1000));
      
      // Update metrics with completion information
      const now = new Date();
      const calculatedMetrics = {
        ...metrics,
        startTime,
        endTime: now,
        completionDate: now.toISOString(),
        actualDuration: metrics.actualDuration || Math.floor((now.getTime() - startTime.getTime()) / 1000),
        // Ensure we have valid fields for completed timer
        isPaused: false,
        pausedTimeLeft: null
      };
      
      // Play completion sound
      playSound();
      
      // Update metrics state
      setCompletionMetrics(calculatedMetrics);
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(calculatedMetrics);
      }
      
      // Show completion screen
      setShowCompletion(true);
      
      // Close expanded view if open
      setIsExpanded(false);
      
      // Complete the timer
      await completeTimer();
      
      // Emit completion event for integration with other components
      eventManager.emit('timer:complete', { 
        taskName, 
        metrics: calculatedMetrics 
      });
      
      console.log("Timer completed with metrics:", calculatedMetrics);
      
    } catch (error) {
      console.error("Error completing timer:", error);
    }
  }, [
    isRunning,
    pause,
    metrics,
    playSound,
    setCompletionMetrics,
    onComplete,
    setShowCompletion,
    setIsExpanded,
    completeTimer,
    taskName,
  ]);

  // Handle timer close
  const handleClose = useCallback(() => {
    // Use a custom event since this event isn't in the eventBus types
    const event = new CustomEvent('timer:close', { detail: { taskName } });
    window.dispatchEvent(event);
    
    // Reset the timer
    reset();
  }, [reset, taskName]);

  // Handle confirmation dialog
  const showResetConfirmation = useCallback(() => {
    setShowConfirmation(true);
  }, [setShowConfirmation]);

  // Handle pause timer
  const handlePause = useCallback(() => {
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
    // Update metrics to indicate timer is no longer paused
    updateMetrics({
      isPaused: false
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
    handleToggle,
    handleAddTime,
    handleReset,
    handleComplete,
    handleClose,
    showResetConfirmation,
    handlePause,
    handleResume,
  };
};
