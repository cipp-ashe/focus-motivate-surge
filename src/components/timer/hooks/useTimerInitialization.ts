
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

  // Set up timer monitoring - ensures Promise is passed correctly
  useTimerMonitoring({
    taskName,
    updateTimeLeft,
    handleComplete: timerHandlers.handleComplete, // This now correctly returns Promise<void>
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
    handleComplete: timerHandlers.handleComplete, // This now correctly returns Promise<void>
    handleAddTime: timerHandlers.handleAddTime,
  });

  // Use the auto-complete hook with correct Promise<void> return type
  const handleAutoComplete = useTimerAutoComplete({
    isRunning,
    pause: pauseTimer,
    playSound,
    metrics,
    completeTimer: timerHandlers.handleComplete, // This now correctly returns Promise<void>
    onComplete,
    taskName,
    setCompletionMetrics,
    setShowCompletion,
  });

  // Create an async wrapper for handleCloseCompletion to return Promise<void>
  const handleCloseCompletion = async (): Promise<void> => {
    setShowCompletion(false);
    setCompletionMetrics(null);
    return Promise.resolve();
  };

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
    timerHandlers: {
      ...timerHandlers,
      handleCloseCompletion, // Use the async version that returns Promise<void>
      handleCloseTimer: timerHandlers.handleClose,
      handleAddTimeAndContinue: timerHandlers.handleAddTime,
      handleComplete: timerHandlers.handleComplete,
    },
    
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
