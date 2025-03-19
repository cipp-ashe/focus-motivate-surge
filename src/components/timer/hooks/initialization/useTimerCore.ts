
import { useRef } from "react";
import { TimerExpandedViewRef } from "@/types/timer";
import { useTimerState } from "./useTimerState";
import { useTimerActions } from "./useTimerActions";
import { useTimerAudio } from "./useTimerAudio";

export const useTimerCore = (duration: number, taskName: string) => {
  // Create a ref for the expanded view
  const expandedViewRef = useRef<TimerExpandedViewRef | null>(null);

  // Initialize the timer state
  const {
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
    setIsLoadingAudio
  } = useTimerState(duration);

  // Initialize timer actions
  const {
    pauseTimerRef,
    startTimer,
    pauseTimer,
    extendTimer,
    resetTimer,
    completeTimerAction,
    updateMetricsAction
  } = useTimerActions({
    timeLeft: timerState.timeLeft,
    metrics: timerState.metrics,
    updateTimeLeft,
    updateMetrics,
    setIsRunning,
    taskName
  });

  // Initialize audio functionality
  const { isLoadingAudio, testSound, playSound } = useTimerAudio(viewState.selectedSound);

  return {
    // Refs
    expandedViewRef,
    pauseTimerRef,
    
    // State getters
    timerState,
    
    // State setters
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    
    // View state
    viewState: {
      ...viewState,
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
  };
};
