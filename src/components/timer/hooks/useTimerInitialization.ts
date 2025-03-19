
import { useState } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { Quote, SoundOption, TimerExpandedViewRef } from "@/types/timer";
import { useTimerCore } from "./initialization/useTimerCore";
import { useTimerHandlers } from "./initialization/useTimerHandlers";
import { useTimerViews, useTimerAutoComplete } from "./initialization/useTimerViews";
import { useTimerMonitoring } from "./initialization/useTimerMonitoring";
import { useTimerEvents } from "./initialization/useTimerEvents";
import { logger } from "@/utils/logManager";

interface UseTimerInitializationProps {
  duration: number;
  taskName: string;
  taskId?: string;
  onComplete?: (metrics: TimerStateMetrics) => void;
  onAddTime?: (minutes: number) => void;
  onDurationChange?: (minutes: number) => void;
}

export const useTimerInitialization = ({
  duration,
  taskName,
  taskId,
  onComplete,
  onAddTime,
  onDurationChange,
}: UseTimerInitializationProps) => {
  // Initialize core timer state and functions
  const {
    // Refs
    expandedViewRef,
    pauseTimerRef,
    
    // State getters
    timerState: {
      timeLeft,
      minutes,
      isRunning,
      metrics,
      isMountedRef
    },
    
    // State setters
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    
    // View state
    viewState: {
      isExpanded,
      selectedSound,
      showCompletion,
      showConfirmation,
      completionMetrics,
      internalMinutes,
      pauseTimeLeft,
      isLoadingAudio
    },
    
    // View state setters
    setIsExpanded,
    setSelectedSound,
    setShowCompletion,
    setShowConfirmation,
    setCompletionMetrics,
    setInternalMinutes,
    setPauseTimeLeft,
    
    // Timer actions
    timerActions: {
      startTimer,
      pauseTimer,
      extendTimer,
      resetTimer,
      completeTimerAction,
      updateMetricsAction
    },
    
    // Audio functions
    audioFunctions: {
      testSound,
      playSound
    }
  } = useTimerCore(duration, taskName);

  // Initialize timer handlers
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
    pauseTimerRef
  });

  // Initialize timer views
  const {
    getTimerCircleProps,
    getTimerControlsProps
  } = useTimerViews({
    isRunning,
    timeLeft,
    minutes,
    metrics,
    isExpanded,
    pauseTimeLeft,
    handleToggle: timerHandlers.handleToggle,
    handleComplete: timerHandlers.handleComplete,
    handleAddTime: timerHandlers.handleAddTime
  });

  // Set up timer monitoring - Fix: pass required parameters
  useTimerMonitoring({
    taskName,
    updateTimeLeft,
    handleComplete: timerHandlers.handleComplete
  });

  // Set up timer event listeners - Fix: pass all required arguments
  useTimerEvents(taskName, duration);

  // Handle auto-complete function
  // Fix: return the function directly without wrapping it in an object
  const autoComplete = useTimerAutoComplete({
    isRunning,
    pause: pauseTimer,
    playSound,
    metrics,
    completeTimer: completeTimerAction,
    onComplete,
    taskName,
    setCompletionMetrics,
    setShowCompletion
  });

  // Log timer initialization
  logger.debug('TimerInitialization', 'Timer initialized with:', {
    duration,
    taskName,
    isRunning,
    timeLeft,
    metrics
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
    setInternalMinutes: (minutes: number) => {
      setInternalMinutes(minutes);
      if (onDurationChange) {
        onDurationChange(minutes);
      }
    },
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
    
    // Auto-complete
    autoComplete
  };
};
