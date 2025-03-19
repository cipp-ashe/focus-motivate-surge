
import { TimerStateMetrics } from "@/types/metrics";
import { useTimerToggle } from "./toggle/useTimerToggle";
import { useTimerAddTime } from "./time/useTimerAddTime";
import { useTimerReset } from "./reset/useTimerReset";
import { useTimerPauseResume } from "./pause/useTimerPauseResume";
import { useTimerClose } from "./close/useTimerClose";
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";

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
  // Toggle timer (start/pause)
  const handleToggle = useTimerToggle({
    taskName,
    isRunning,
    timeLeft,
    metrics,
    updateMetrics,
    pause,
    start,
  });

  // Add time to timer
  const handleAddTime = useTimerAddTime({
    addTime,
    onAddTime,
    taskName,
    metrics,
    timeLeft,
    isRunning,
  });

  // Reset timer
  const { handleReset, showResetConfirmation } = useTimerReset({
    reset,
    setShowConfirmation,
    taskName,
    metrics,
  });

  // Complete timer handler - inline implementation
  const handleComplete = useCallback(async (): Promise<void> => {
    try {
      console.log("TimerHandlers: Starting timer completion process");
      
      // If timer is running, pause it first
      if (isRunning) {
        pause();
      }
      
      // Calculate end time
      const now = new Date();
      
      // Play sound to indicate completion
      setTimeout(() => {
        playSound();
      }, 300);
      
      // Call the provided completeTimer function
      await completeTimer();
      
      // Show completion UI
      setShowCompletion(true);
      
      // Emit completion event
      eventManager.emit('timer:complete', { 
        taskName, 
        metrics 
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error during timer completion:", error);
      return Promise.reject(error);
    }
  }, [
    isRunning,
    pause,
    completeTimer,
    playSound,
    setShowCompletion,
    taskName,
    metrics
  ]);

  // Pause/Resume timer
  const { handlePause, handleResume } = useTimerPauseResume({
    taskName,
    timeLeft,
    metrics,
    updateMetrics,
    pause,
    start,
    setPauseTimeLeft,
  });

  // Close timer
  const handleClose = useTimerClose({
    reset,
    taskName,
  });

  // Add handler for closing completion view
  const handleCloseCompletion = () => {
    setShowCompletion(false);
    setCompletionMetrics(null);
  };

  // Add handler for adding time and continuing
  const handleAddTimeAndContinue = () => {
    // Add 5 minutes by default
    handleAddTime(5);
    setShowConfirmation(false);
  };

  return {
    handleToggle,
    handleAddTime,
    handleReset,
    handleComplete,
    handleClose,
    handleCloseCompletion,
    handleCloseTimer: handleClose,
    handleAddTimeAndContinue,
    showResetConfirmation,
    handlePause,
    handleResume,
    isPaused: metrics.isPaused || false
  };
};
