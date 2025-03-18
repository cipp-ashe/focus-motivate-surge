
import { useTimerCore } from "./initialization/useTimerCore";
import { useTimerHandlers } from "./initialization/useTimerHandlers";
import { useTimerViews, useTimerAutoComplete } from "./initialization/useTimerViews";
import { TimerProps } from "@/types/timer";
import { useEffect, useState } from "react";
import { eventManager } from "@/lib/events/EventManager";
import { logger } from "@/utils/logManager";

export const useTimerInitialization = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  taskId
}: Pick<TimerProps, "duration" | "taskName" | "onComplete" | "onAddTime" | "onDurationChange"> & { taskId?: string }) => {
  if (!duration || !taskName) {
    throw new Error('Timer initialization requires valid duration and taskName');
  }

  try {
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
    const { timeLeft, minutes, isRunning, metrics, isMountedRef } = timerState;
    const { 
      isExpanded, selectedSound, showCompletion, showConfirmation, 
      completionMetrics, internalMinutes, pauseTimeLeft, isLoadingAudio 
    } = viewState;
    const { 
      startTimer, pauseTimer, extendTimer, resetTimer 
    } = timerActions;
    const { testSound, playSound } = audioFunctions;

    // Register the component for timer events
    useEffect(() => {
      logger.debug('TimerInitialization', `Initializing timer for task: ${taskName} with duration: ${duration}`);
      
      // Add taskId to metrics if available
      if (taskId) {
        // Update metrics to include the taskId
        updateMetrics({ taskId });
      }
      
      // Emit initialization event
      eventManager.emit('timer:init', {
        taskName,
        duration,
        taskId
      });
      
      // Set up timer monitoring
      const handleTick = (event: CustomEvent) => {
        if (isMountedRef.current) {
          const { timeLeft } = event.detail;
          updateTimeLeft(timeLeft);
        }
      };
      
      // Listen for timer tick events
      window.addEventListener('timer:tick', handleTick as EventListener);
      
      // Clean up on unmount
      return () => {
        logger.debug('TimerInitialization', `Cleaning up timer for task: ${taskName}`);
        window.removeEventListener('timer:tick', handleTick as EventListener);
      };
    }, [taskName, duration, updateTimeLeft, isMountedRef, taskId, updateMetrics]);

    // Set up timer event handlers
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

    // Use the auto-complete hook for automatic timer completion
    const autoCompleteHandler = useTimerAutoComplete({
      isRunning,
      pause: pauseTimer,
      playSound,
      metrics,
      completeTimer: timerHandlers.handleComplete,
      onComplete,
      taskName,
      setCompletionMetrics,
      setShowCompletion,
    });

    // Create an async wrapper for handleCloseCompletion
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
        handleCloseCompletion,
        handleCloseTimer: timerHandlers.handleClose,
        handleAddTimeAndContinue: timerHandlers.handleAddTime,
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
  } catch (error) {
    console.error("Error in useTimerInitialization:", error);
    throw new Error(`Timer initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
