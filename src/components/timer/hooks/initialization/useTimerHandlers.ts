
import { useCallback } from "react";
import { useTimerHandlers as useBaseTimerHandlers } from "../../handlers/TimerHandlers";
import { useTimerComplete } from "./useTimerComplete";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerHandlersProps {
  taskName: string;
  isRunning: boolean;
  timeLeft: number;
  metrics: TimerStateMetrics;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => Promise<void>;
  extendTimer: (minutes: number) => void;
  playSound: () => void;
  onAddTime?: (minutes: number) => void;
  onComplete?: (metrics: TimerStateMetrics) => void;
  setShowConfirmation: (show: boolean) => void;
  setCompletionMetrics: (metrics: any) => void;
  setShowCompletion: (show: boolean) => void;
  setIsExpanded: (expanded: boolean) => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setPauseTimeLeft: (timeLeft: number | null) => void;
  pauseTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export const useTimerHandlers = ({
  taskName,
  isRunning,
  timeLeft,
  metrics,
  startTimer,
  pauseTimer,
  resetTimer,
  extendTimer,
  playSound,
  onAddTime,
  onComplete,
  setShowConfirmation,
  setCompletionMetrics,
  setShowCompletion,
  setIsExpanded,
  updateMetrics,
  setPauseTimeLeft,
  pauseTimerRef,
}: UseTimerHandlersProps) => {
  // Use the timer completion hook - this returns a function directly
  const completeTimer = useTimerComplete({
    taskName,
    metrics,
    setIsExpanded,
    onComplete: onComplete || (() => {})
  });

  // Initialize handlers with consistent function signatures
  const timerHandlers = useBaseTimerHandlers({
    taskName,
    isRunning,
    timeLeft,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    addTime: extendTimer,
    // Pass the direct function, not an object
    completeTimer: completeTimer,
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
  });

  return timerHandlers;
};
