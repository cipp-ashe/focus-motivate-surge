
import { useRef } from "react";
import { TimerProps } from "@/types/timer";
import { useTimerComplete } from "../state/TimerState";
import { TimerExpandedViewRef } from "@/types/timer";
import { useTimerHandlers } from "../handlers/TimerHandlers";
import { useTimerMonitor } from "@/hooks/useTimerMonitor";
import { useTimerView } from "./useTimerView";
import { useTimerEventListeners } from "./useTimerEventListeners";
import { useAutoComplete } from "./useAutoComplete";
import { useTimerState } from "@/hooks/timer/useTimerState";

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
  const isExpanded = true; // Start expanded by default
  const [selectedSound, setSelectedSound] = useState({ id: 'bell', label: 'Bell', file: 'bell.mp3' });
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState(null);
  const [internalMinutes, setInternalMinutes] = useState(Math.floor(duration / 60));
  const [pauseTimeLeft, setPauseTimeLeft] = useState(null);
  const pauseTimerRef = useRef(null);
  
  // Import timer action hooks
  const { 
    start, 
    pause, 
    addTime, 
    reset, 
    completeTimer, 
    playSound, 
    testSound, 
    isLoadingAudio, 
    setMinutes 
  } = useTimerActions({ timeLeft, metrics, updateTimeLeft, updateMetrics, setIsRunning });

  // Use the timer completion hook
  const { completeTimer: timerComplete } = useTimerComplete({
    taskName,
    metrics,
    setIsExpanded: (value) => {
      // Implement this function
    },
    onComplete
  });

  // Set up event listeners
  useTimerEventListeners({
    taskName,
    setInternalMinutes,
    setIsExpanded: (value) => {
      // Implement this function
    },
    expandedViewRef,
  });

  // Initialize handlers
  const timerHandlers = useTimerHandlers({
    taskName,
    isRunning,
    start,
    pause,
    addTime,
    completeTimer: timerComplete,
    playSound,
    onAddTime,
    onComplete,
    setShowConfirmation,
    setCompletionMetrics,
    setShowCompletion,
    setIsExpanded: (value) => {
      // Implement this function
    },
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
    completeTimer: timerComplete,
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

// Add missing imports
import { useState } from 'react';
import { useTimerActions } from '@/hooks/timer/useTimerActions';
