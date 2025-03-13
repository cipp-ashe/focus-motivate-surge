
import { useCallback } from "react";
import { eventBus } from "@/lib/eventBus";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";

interface TimerHandlersProps {
  taskName: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => Promise<void>;
  addTime: (minutes: number) => void;  // Consistent signature
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
}: TimerHandlersProps) => {
  // Handle toggle button click
  const handleToggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  // Handle add time button click - explicitly accepting minutes parameter
  const handleAddTime = useCallback(
    (minutes: number = TIMER_CONSTANTS.ADD_TIME_MINUTES) => {
      console.log(`Adding ${minutes} minutes to timer`);
      
      addTime(minutes);
      
      // Call onAddTime callback if provided
      if (onAddTime) {
        onAddTime(minutes);
      }
    },
    [addTime, onAddTime]
  );

  // Handle timer reset
  const handleReset = useCallback(async () => {
    await reset();
    setShowConfirmation(false);
  }, [reset, setShowConfirmation]);

  // Handle timer completion
  const handleComplete = useCallback(async () => {
    if (isRunning) {
      pause();
    }
    
    try {
      // Calculate completion metrics
      const calculatedMetrics = {
        ...metrics,
        completionDate: new Date().toISOString(),
      };
      
      // Play completion sound
      playSound();
      
      // Update metrics
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
      eventBus.emit('timer:complete', { 
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
    setPauseTimeLeft(metrics.pausedTimeLeft || null);
    
    // Store pause timestamp
    updateMetrics({
      lastPauseTimestamp: new Date(),
      pauseCount: metrics.pauseCount + 1,
      isPaused: true
    });
    
    // Actually pause the timer
    pause();
  }, [pause, setPauseTimeLeft, metrics.pausedTimeLeft, metrics.pauseCount, updateMetrics]);

  return {
    handleToggle,
    handleAddTime,
    handleReset,
    handleComplete,
    handleClose,
    showResetConfirmation,
    handlePause,
  };
};
