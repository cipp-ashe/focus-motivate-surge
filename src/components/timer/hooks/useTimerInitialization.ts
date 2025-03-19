
import { TimerStateMetrics } from "@/types/metrics";
import { useTimerCore } from "./initialization/useTimerCore";
import { useTimerHandlers } from "./initialization/useTimerHandlers";
import { useTimerViews } from "./initialization/useTimerViews";
import { useTimerMonitoring } from "./initialization/useTimerMonitoring";
import { useTimerEvents } from "./initialization/useTimerEvents";
import { useTimerComplete } from "./initialization/useTimerComplete";
import { useAutoComplete } from "./useAutoComplete";
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
    timerState,
    
    // State setters
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    
    // View state
    viewState,
    
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

  // Create a function to complete the timer - this returns a function directly
  const completeTimerFn = useTimerComplete({
    taskName,
    metrics: timerState.metrics,
    setIsExpanded,
    onComplete: onComplete || (() => {})
  });

  // Initialize timer handlers
  const timerHandlers = useTimerHandlers({
    taskName,
    isRunning: timerState.isRunning,
    timeLeft: timerState.timeLeft,
    metrics: timerState.metrics,
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
    // Pass the direct function here
    completeTimer: completeTimerFn
  });

  // Initialize timer views
  const {
    getTimerCircleProps,
    getTimerControlsProps
  } = useTimerViews({
    isRunning: timerState.isRunning,
    timeLeft: timerState.timeLeft,
    minutes: timerState.minutes,
    metrics: timerState.metrics,
    isExpanded: viewState.isExpanded,
    pauseTimeLeft: viewState.pauseTimeLeft,
    handleToggle: timerHandlers.handleToggle,
    handleComplete: timerHandlers.handleComplete,
    handleAddTime: timerHandlers.handleAddTime
  });

  // Set up timer monitoring - pass the direct function
  useTimerMonitoring({
    taskName,
    updateTimeLeft,
    handleComplete: completeTimerFn
  });

  // Set up timer event listeners
  useTimerEvents(taskName, duration);

  // Auto-complete function
  const autoComplete = useAutoComplete({
    isRunning: timerState.isRunning,
    pause: pauseTimer,
    playSound,
    metrics: timerState.metrics,
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
    isRunning: timerState.isRunning,
    timeLeft: timerState.timeLeft,
    metrics: timerState.metrics
  });

  return {
    // Refs
    expandedViewRef,
    
    // State
    isExpanded: viewState.isExpanded,
    selectedSound: viewState.selectedSound,
    setSelectedSound,
    showCompletion: viewState.showCompletion,
    showConfirmation: viewState.showConfirmation,
    setShowConfirmation,
    completionMetrics: viewState.completionMetrics,
    internalMinutes: viewState.internalMinutes,
    setInternalMinutes: (minutes: number) => {
      setInternalMinutes(minutes);
      if (onDurationChange) {
        onDurationChange(minutes);
      }
    },
    metrics: timerState.metrics,
    isRunning: timerState.isRunning,
    
    // Handlers
    timerHandlers,
    
    // Props generators
    getTimerCircleProps,
    getTimerControlsProps,
    
    // Utility functions
    testSound,
    updateMetrics,
    isLoadingAudio: viewState.isLoadingAudio,
    
    // Auto-complete function
    autoComplete
  };
};
