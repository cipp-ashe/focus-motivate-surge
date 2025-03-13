
import { useRef, useState, useEffect } from "react";
import { TimerProps } from "@/types/timer";
import { TimerExpandedViewRef } from "@/types/timer";
import { useTimerHandlers } from "../handlers/TimerHandlers";
import { useTimerMonitor } from "@/hooks/useTimerMonitor";
import { useTimerView } from "./useTimerView";
import { useTimerEventListeners } from "./useTimerEventListeners";
import { useAutoComplete } from "./useAutoComplete";
import { useTimerState } from "@/hooks/timer/useTimerState";
import { useTimerActions } from '@/hooks/timer/useTimerActions';
import { useTimerComplete } from "../state/TimerState";
import { TimerActionProps } from "@/hooks/timer/types/UseTimerTypes";
import { eventManager } from "@/lib/events/EventManager";

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
    console.log('Testing sound:', selectedSound);
    setIsLoadingAudio(true);
    // Simulate sound playing
    setTimeout(() => {
      setIsLoadingAudio(false);
    }, 500);
  };
  
  const playSound = () => {
    console.log('Playing completion sound:', selectedSound);
    // Play sound implementation
  };

  // Use the timer completion hook
  const { completeTimer: timerComplete } = useTimerComplete({
    taskName,
    metrics,
    setIsExpanded,
    onComplete: onComplete || (() => {})
  });

  // Set up event listeners
  useTimerEventListeners({
    taskName,
    setInternalMinutes,
    setIsExpanded,
    expandedViewRef,
  });

  // Emit an initialization event when the component mounts
  useEffect(() => {
    console.log(`Initializing timer for task: ${taskName} with duration: ${duration}`);
    eventManager.emit('timer:init', {
      taskName,
      duration
    });
    
    // Clean up on unmount
    return () => {
      console.log(`Cleaning up timer for task: ${taskName}`);
    };
  }, [taskName, duration]);

  // Initialize handlers with consistent function signatures
  const timerHandlers = useTimerHandlers({
    taskName,
    isRunning,
    timeLeft, // Pass timeLeft to handlers
    start: startTimer,
    pause: pauseTimer,
    addTime: extendTimer,
    completeTimer: async () => {
      timerComplete();
      return Promise.resolve();
    },
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
    reset: async () => {
      resetTimer();
      return Promise.resolve();
    },
  });

  // Monitor timer state
  useTimerMonitor({
    onTick: (seconds) => {
      console.log(`Timer tick: ${seconds}s remaining for ${taskName}`);
      updateTimeLeft(seconds);
      
      // Emit tick event
      eventManager.emit('timer:tick', {
        taskName,
        remaining: seconds,
        timeLeft: seconds
      });
    },
    onComplete: () => {
      timerHandlers.handleComplete();
    },
    onStart: (task, duration) => {
      console.log(`Timer started for ${task} with duration ${duration}`);
    },
    onPause: () => {
      console.log(`Timer paused for ${taskName}`);
    },
    onResume: () => {
      console.log(`Timer resumed for ${taskName}`);
    }
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
    pause: pauseTimer,
    playSound,
    metrics,
    completeTimer: () => {
      // Fix: Convert synchronous function to Promise
      timerComplete();
      return Promise.resolve();
    },
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
