
import { useTimerView } from "../useTimerView";
import { useAutoComplete } from "../useAutoComplete";
import { TimerStateMetrics } from "@/types/metrics";

interface UseTimerViewsProps {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  metrics: TimerStateMetrics;
  isExpanded: boolean;
  pauseTimeLeft: number | null;
  handleToggle: () => void;
  handleComplete: () => Promise<void>;  // Updated to match correct return type
  handleAddTime: (minutes: number) => void;
}

export const useTimerViews = ({
  isRunning,
  timeLeft,
  minutes,
  metrics,
  isExpanded,
  pauseTimeLeft,
  handleToggle,
  handleComplete,
  handleAddTime,
}: UseTimerViewsProps) => {
  // Get view props
  const { getTimerCircleProps, getTimerControlsProps } = useTimerView({
    isRunning,
    timeLeft,
    minutes,
    metrics,
    isExpanded,
    handleTimerToggle: handleToggle,
    handleComplete,
    handleAddTime,
    pauseTimeLeft,
  });

  return {
    getTimerCircleProps,
    getTimerControlsProps,
  };
};

interface UseAutoCompleteProps {
  isRunning: boolean;
  pause: () => void;
  playSound: () => void;
  metrics: TimerStateMetrics;
  completeTimer: () => Promise<void>;
  onComplete?: (metrics: TimerStateMetrics) => void;
  taskName: string;
  setCompletionMetrics: (metrics: TimerStateMetrics | null) => void;
  setShowCompletion: (show: boolean) => void;
}

export const useTimerAutoComplete = (props: UseAutoCompleteProps) => {
  // Pass props through to useAutoComplete
  return useAutoComplete(props);
};
