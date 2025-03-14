
import { TimerStateMetrics } from "@/types/metrics";
import { useTimerToggle } from "./toggle/useTimerToggle";
import { useTimerAddTime } from "./time/useTimerAddTime";
import { useTimerReset } from "./reset/useTimerReset";
import { useTimerComplete } from "./complete/useTimerComplete";
import { useTimerPauseResume } from "./pause/useTimerPauseResume";
import { useTimerClose } from "./close/useTimerClose";

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

  // Complete timer - ensure it matches the type of completeTimer (Promise<void>)
  const handleComplete = useTimerComplete({
    isRunning,
    pause,
    playSound,
    setCompletionMetrics,
    setShowCompletion,
    setIsExpanded,
    completeTimer,
    onComplete,
    metrics,
    taskName,
  });

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
