
import { useTimerCore } from "./initialization/useTimerCore";
import { useTimerEvents } from "./initialization/useTimerEvents";
import { useTimerHandlers } from "./initialization/useTimerHandlers";
import { useTimerMonitoring } from "./initialization/useTimerMonitoring";
import { useTimerViews, useTimerAutoComplete } from "./initialization/useTimerViews";
import { TimerProps } from "@/types/timer";

export const useTimerInitialization = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
}: Pick<TimerProps, "duration" | "taskName" | "onComplete" | "onAddTime" | "onDurationChange">) => {
  // Core timer state and functions
  const {
    expandedViewRef,
    pauseTimerRef,
    timerState,
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    viewState,
    setIsExpanded,
    setSelectedSound,
    setShowCompletion,
    setShowConfirmation,
    setCompletionMetrics,
    setInternalMinutes,
    setPauseTimeLeft,
    timerActions,
    audioFunctions
  } = useTimerCore(duration, taskName);

  // Destructure for easier access and readability
  const { timeLeft, minutes, isRunning, metrics } = timerState;
  const { 
    isExpanded, selectedSound, showCompletion, showConfirmation, 
    completionMetrics, internalMinutes, pauseTimeLeft, isLoadingAudio 
  } = viewState;
  const { 
    startTimer, pauseTimer, extendTimer, resetTimer 
  } = timerActions;
  const { testSound, playSound } = audioFunctions;

  // Register timer events
  useTimerEvents(taskName, duration);

  // Set up event listeners for the timer
  const timerHandlers = useTimerHandlers({
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
  });

  // Set up timer monitoring
  useTimerMonitoring({
    taskName,
    updateTimeLeft,
    handleComplete: timerHandlers.handleComplete,
  });

  // Get view props
  const { getTimerCircleProps, getTimerControlsProps } = useTimerViews({
    isRunning,
    timeLeft,
    minutes,
    metrics,
    isExpanded,
    pauseTimeLeft,
    handleToggle: timerHandlers.handleToggle,
    handleComplete: timerHandlers.handleComplete,
    handleAddTime: timerHandlers.handleAddTime,
  });

  // Handle auto-completion
  const handleAutoComplete = useTimerAutoComplete({
    isRunning,
    pause: pauseTimer,
    playSound,
    metrics,
    // Fixed: Pass the Promise-returning function directly
    completeTimer: timerHandlers.handleComplete,
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
    
    // Pass through taskName to satisfy TypeScript
    taskName,
  };
};
