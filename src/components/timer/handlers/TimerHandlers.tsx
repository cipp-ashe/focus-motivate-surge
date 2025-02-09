
import { useCallback, useRef } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";
import { toast } from "sonner";

interface UseTimerHandlersProps {
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
  reset: () => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setPauseTimeLeft: (time: number) => void;
  pauseTimerRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
}

export const useTimerHandlers = ({
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
      setTimeout(() => {
        setCompletionMetrics(metrics);
        setShowCompletion(true);
      }, 0);
    } catch (error) {
      console.error('Error in timer completion flow:', error);
      toast.error("An error occurred while completing the timer ⚠️");
    }
  }, [completeTimer, playSound, metrics, setCompletionMetrics, setShowCompletion]);

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
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
      setPauseTimeLeft(0);
    }
    start();
  }, [start, pauseTimerRef, setPauseTimeLeft]);

  const handlePause = useCallback(() => {
    pause();
    setPauseTimeLeft(300); // 5 minutes in seconds
    pauseTimerRef.current = setInterval(() => {
      setPauseTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(pauseTimerRef.current);
          playSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [pause, playSound, setPauseTimeLeft, pauseTimerRef]);

  const handleToggle = useCallback((fromExpanded = false) => {
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
      if (!fromExpanded) {
        setIsExpanded(true);
      }
    }
  }, [isRunning, handlePause, handleStart, setIsExpanded]);

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

  return {
    handleTimerCompletion,
    handleComplete,
    handleAddTimeAndContinue,
    handleStart,
    handlePause,
    handleToggle,
    handleCloseCompletion,
    handleAddTime,
  };
};
