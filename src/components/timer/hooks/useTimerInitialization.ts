
import { useRef } from "react";
import { TimerProps } from "@/types/timer";
import { useTimerState } from "../state/TimerState";
import { TimerExpandedViewRef } from "@/types/timer";
import { useTimerHandlers } from "../handlers/TimerHandlers";
import { useTimerMonitor } from "@/hooks/useTimerMonitor";
import { useTimerView } from "./useTimerView";
import { useTimerEventListeners } from "./useTimerEventListeners";
import { useAutoComplete } from "./useAutoComplete";

export const useTimerInitialization = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
}: Pick<TimerProps, "duration" | "taskName" | "onComplete" | "onAddTime" | "onDurationChange">) => {
  // Create a ref for the expanded view
  const expandedViewRef = useRef<TimerExpandedViewRef | null>(null);

  // Initialize the timer state
  const timerState = useTimerState({
    duration,
    taskName,
    onComplete,
    onAddTime,
    onDurationChange,
  });

  // Extract values from timer state
  const {
    isExpanded,
    setIsExpanded,
    selectedSound,
    setSelectedSound,
    showCompletion,
    setShowCompletion,
    showConfirmation,
    setShowConfirmation,
    completionMetrics,
    setCompletionMetrics,
    internalMinutes,
    setInternalMinutes,
    pauseTimeLeft,
    setPauseTimeLeft,
    pauseTimerRef,
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start,
    pause,
    addTime,
    setMinutes,
    completeTimer,
    updateMetrics,
    playSound,
    testSound,
    isLoadingAudio,
    reset,
  } = timerState;

  // Set up event listeners
  useTimerEventListeners({
    taskName,
    setInternalMinutes,
    setIsExpanded,
    expandedViewRef,
  });

  // Initialize handlers
  const timerHandlers = useTimerHandlers({
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
  });

  // Monitor timer state
  useTimerMonitor({
    timeLeft,
    isRunning,
    metrics,
    componentName: 'Timer'
  });

  // Get view props
  const { getTimerCircleProps, getTimerControlsProps } = useTimerView({
    isRunning,
    timeLeft,
    minutes,
    metrics,
    isExpanded,
    handleTimerToggle: timerHandlers.handleToggle,
    handleComplete: timerHandlers.handleComplete,
    handleAddTime: timerHandlers.handleAddTime,
    pauseTimeLeft,
  });

  // Handle auto-completion
  const handleAutoComplete = useAutoComplete({
    isRunning,
    pause,
    playSound,
    metrics,
    completeTimer,
    onComplete,
    taskName,
    setCompletionMetrics,
    setShowCompletion,
  });

  return {
    // Refs
    expandedViewRef,
    
    // State
    isExpanded,
    selectedSound,
    setSelectedSound,
    showCompletion,
    showConfirmation,
    setShowConfirmation,
    completionMetrics,
    internalMinutes,
    setInternalMinutes,
    metrics,
    isRunning,
    
    // Handlers
    timerHandlers,
    
    // Props generators
    getTimerCircleProps,
    getTimerControlsProps,
    
    // Utility functions
    testSound,
    updateMetrics,
    isLoadingAudio,
  };
};
