
import { useState, useRef } from "react";
import { TimerExpandedViewRef } from "@/types/timer";
import { useTimerState } from "@/hooks/timer/useTimerState";
import { useTimerActions } from '@/hooks/timer/useTimerActions';
import { TimerActionProps } from "@/hooks/timer/types/UseTimerTypes";
import { logger } from "@/utils/logManager";

export const useTimerCore = (duration: number, taskName: string) => {
  // Create a ref for the expanded view
  const expandedViewRef = useRef<TimerExpandedViewRef | null>(null);

  // Initialize the timer state
  const timerState = useTimerState(duration);
  const {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    isMountedRef,
  } = timerState;

  // Initialize view state separately
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'bell' | 'chime' | 'ding' | 'none'>('bell');
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState(null);
  const [internalMinutes, setInternalMinutes] = useState(Math.floor(duration / 60));
  const [pauseTimeLeft, setPauseTimeLeft] = useState<number | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Import timer action hooks with the legacy interface
  const timerActionProps: TimerActionProps = {
    timeLeft, 
    metrics, 
    updateTimeLeft, 
    updateMetrics, 
    setIsRunning 
  };
  
  const { 
    startTimer, 
    pauseTimer, 
    extendTimer, 
    resetTimer, 
    completeTimer: completeTimerAction,
    updateMetrics: updateMetricsAction
  } = useTimerActions(timerActionProps);

  // Add audio functionality
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const testSound = () => {
    logger.debug('TimerAudio', `Testing sound: ${selectedSound}`);
    setIsLoadingAudio(true);
    // Simulate sound playing
    setTimeout(() => {
      setIsLoadingAudio(false);
    }, 500);
  };
  
  const playSound = () => {
    logger.debug('TimerAudio', `Playing completion sound: ${selectedSound}`);
    // Play sound implementation
  };

  return {
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
    setIsLoadingAudio,
    
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
