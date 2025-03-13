
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";
import { toast } from "sonner";

interface UseTimerHandlersProps {
  taskName: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  addTime: (minutes: number) => void;
  completeTimer: () => void;
  playSound: () => Promise<void>;
  onAddTime?: () => void;
  onComplete?: (metrics: TimerStateMetrics) => void;
  setShowConfirmation: (show: boolean) => void;
  setCompletionMetrics: (metrics: TimerStateMetrics | null) => void;
  setShowCompletion: (show: boolean) => void;
  setIsExpanded: (expanded: boolean) => void;
  metrics: TimerStateMetrics;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setPauseTimeLeft: (time: number | ((prev: number) => number)) => void;
  pauseTimerRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
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
  reset,
  updateMetrics,
  setPauseTimeLeft,
  pauseTimerRef,
}: UseTimerHandlersProps) => {
  const handleTimerCompletion = useCallback(async () => {
    try {
      await completeTimer();
      await playSound();
      
      // We need to ensure we set the completion state and metrics before collapsing
      setCompletionMetrics(metrics);
      setShowCompletion(true);
      setIsExpanded(false); // Collapse the expanded view on completion
      
      toast.success("Timer completed! 🎉");
    } catch (error) {
      console.error('Error in timer completion flow:', error);
      toast.error("An error occurred while completing the timer ⚠️");
    }
  }, [completeTimer, playSound, metrics, setCompletionMetrics, setShowCompletion, setIsExpanded]);

  const handleComplete = useCallback(async () => {
    setShowConfirmation(false);
    await handleTimerCompletion();
  }, [handleTimerCompletion, setShowConfirmation]);

  const handleAddTimeAndContinue = useCallback(() => {
    setShowConfirmation(false);
    addTime(TIMER_CONSTANTS.ADD_TIME_MINUTES);
    if (typeof onAddTime === 'function') {
      onAddTime();
    }
    start();
    toast.success(`Added ${TIMER_CONSTANTS.ADD_TIME_MINUTES} minutes. Keep going! ⌛💪`);
  }, [addTime, onAddTime, start, setShowConfirmation]);

  const handleStart = useCallback(() => {
    console.log('Handling timer start');
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
      setPauseTimeLeft(0);
    }
    
    // IMPORTANT: First start the timer, then ensure expanded view is set
    start();
    
    // Make sure the timer is expanded immediately
    setIsExpanded(true);
    
    toast.success("Timer started! Let's focus! 🎯");
  }, [start, pauseTimerRef, setPauseTimeLeft, setIsExpanded]);

  const handlePause = useCallback(() => {
    console.log('Handling timer pause');
    pause();
    setPauseTimeLeft(300); // 5 minutes in seconds
    pauseTimerRef.current = setInterval(() => {
      setPauseTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(pauseTimerRef.current);
          playSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Do not collapse on pause
    toast.info("Timer paused. Take a short break!");
  }, [pause, playSound, setPauseTimeLeft, pauseTimerRef]);

  const handleToggle = useCallback(() => {
    console.log('Handling timer toggle:', { isRunning });
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
    }
  }, [isRunning, handlePause, handleStart]);

  const handleCloseCompletion = useCallback(() => {
    if (typeof onComplete === 'function' && metrics) {
      onComplete(metrics);
    }
    setShowCompletion(false);
    setIsExpanded(false);
    setCompletionMetrics(null);
    reset();
    toast.success("Task completed! You're crushing it! 🎯🎉");
  }, [onComplete, metrics, setShowCompletion, setIsExpanded, setCompletionMetrics, reset]);

  const handleAddTime = useCallback(() => {
    addTime(TIMER_CONSTANTS.ADD_TIME_MINUTES);
    if (typeof onAddTime === 'function') {
      onAddTime();
    }
    toast.success(`Added ${TIMER_CONSTANTS.ADD_TIME_MINUTES} minutes. Keep going! ⌛💪`);
  }, [addTime, onAddTime]);

  const handleCloseTimer = useCallback(() => {
    // Only collapse the expanded view, don't reset the timer
    setIsExpanded(false);
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
      setPauseTimeLeft(0);
    }
  }, [setIsExpanded, pauseTimerRef, setPauseTimeLeft]);

  return {
    handleTimerCompletion,
    handleComplete,
    handleAddTimeAndContinue,
    handleStart,
    handlePause,
    handleToggle,
    handleCloseCompletion,
    handleAddTime,
    handleCloseTimer,
  };
};
