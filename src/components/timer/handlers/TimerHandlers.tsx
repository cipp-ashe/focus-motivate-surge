
import { useCallback, RefObject } from "react";
import { eventBus } from "@/lib/eventBus";
import { toast } from "sonner";
import { TimerStateMetrics } from "@/types/metrics";

interface TimerHandlersProps {
  taskName: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  addTime: (minutes: number) => void;
  completeTimer: () => TimerStateMetrics;
  playSound: () => void;
  onAddTime?: () => void;
  onComplete?: (metrics: TimerStateMetrics) => void;
  setShowConfirmation: (show: boolean) => void;
  setCompletionMetrics: (metrics: TimerStateMetrics | null) => void;
  setShowCompletion: (show: boolean) => void;
  setIsExpanded: (expanded: boolean) => void;
  metrics: TimerStateMetrics;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setPauseTimeLeft: (time: number | null) => void;
  pauseTimerRef: RefObject<NodeJS.Timeout | null>;
  reset: () => void;
}

export const useTimerHandlers = ({
  taskName,
  isRunning,
  start,
  pause,
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
  reset,
}: TimerHandlersProps) => {
  // Toggle timer state (start/pause)
  const handleToggle = useCallback(() => {
    if (isRunning) {
      console.log('[TimerHandlers] Pausing timer');
      pause();
      updateMetrics({ isPaused: true });
      toast.info(`Timer paused for: ${taskName}`);
    } else {
      console.log('[TimerHandlers] Starting timer');
      start();
      updateMetrics({ 
        isPaused: false,
        startTime: metrics.startTime || new Date()
      });
      
      // Auto expand when starting timer
      setIsExpanded(true);
      toast.success(`Timer started for: ${taskName}`);
    }
  }, [isRunning, start, pause, taskName, updateMetrics, metrics.startTime, setIsExpanded]);

  // Handle completing the timer
  const handleComplete = useCallback(() => {
    console.log('[TimerHandlers] Completing timer');
    
    // Don't auto-expand for completion
    setIsExpanded(false);
    
    // Calculate final metrics
    const completedMetrics = completeTimer();
    
    // Play completion sound
    playSound();
    
    // Call external onComplete callback if provided
    if (onComplete) {
      onComplete(completedMetrics);
    }
    
    // Set completion state
    setCompletionMetrics(completedMetrics);
    setShowCompletion(true);
    
    // Return to timer selection after delay
    // We don't auto-reset here to allow user to see metrics
    
    // Emit event for completion
    eventBus.emit('timer:complete', { 
      taskName,
      metrics: completedMetrics
    });
    
    toast.success(`Timer completed for: ${taskName}`);
  }, [completeTimer, playSound, onComplete, setCompletionMetrics, setShowCompletion, taskName, setIsExpanded]);

  // Add more time to the timer
  const handleAddTime = useCallback(() => {
    console.log('[TimerHandlers] Adding time to timer');
    const minutes = 5;
    addTime(minutes);
    
    // Update extension metrics
    updateMetrics({
      extensionTime: (metrics.extensionTime || 0) + (minutes * 60)
    });
    
    // Call external onAddTime callback if provided
    if (onAddTime) {
      onAddTime();
    }
    
    toast.info(`Added ${minutes} minutes to timer`);
  }, [addTime, onAddTime, updateMetrics, metrics.extensionTime]);

  // Close the completion view
  const handleCloseCompletion = useCallback(() => {
    console.log('[TimerHandlers] Closing completion view');
    setShowCompletion(false);
    setCompletionMetrics(null);
    reset();
  }, [setShowCompletion, setCompletionMetrics, reset]);

  // Close the entire timer
  const handleCloseTimer = useCallback(() => {
    console.log('[TimerHandlers] Closing timer');
    // Reset timer state
    reset();
    
    // Reset completion
    setShowCompletion(false);
    setCompletionMetrics(null);
    
    // Collapse any expanded view
    setIsExpanded(false);
    
    // Emit close event
    eventBus.emit('timer:close', { taskName });
  }, [reset, setShowCompletion, setCompletionMetrics, setIsExpanded, taskName]);

  // Add time and continue timer
  const handleAddTimeAndContinue = useCallback(() => {
    console.log('[TimerHandlers] Adding time and continuing');
    // Add 5 minutes and continue
    const minutes = 5;
    addTime(minutes);
    
    // Update extension metrics
    updateMetrics({
      extensionTime: (metrics.extensionTime || 0) + (minutes * 60)
    });
    
    // Call external onAddTime callback if provided
    if (onAddTime) {
      onAddTime();
    }
    
    // Hide confirmation
    setShowConfirmation(false);
    
    // Start timer if not running
    if (!isRunning) {
      start();
    }
    
    toast.info(`Added ${minutes} minutes to timer`);
  }, [addTime, onAddTime, updateMetrics, metrics.extensionTime, setShowConfirmation, isRunning, start]);

  return {
    handleToggle,
    handleComplete,
    handleAddTime,
    handleCloseCompletion,
    handleCloseTimer,
    handleAddTimeAndContinue,
  };
};
