
import { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { TimerState, TimerAction } from '@/types/timer';
import { timerReducer } from './useTimerReducer';
import { UseTimerOptions } from './types/UseTimerTypes';
import { eventManager } from '@/lib/events/EventManager';
import { logger } from '@/utils/logManager';

export const useTimerCore = (options: UseTimerOptions | number = 25) => {
  // Convert options to standardized format
  const initialOptions: UseTimerOptions = typeof options === 'number' 
    ? { initialMinutes: options } 
    : options;
  
  // Extract values with defaults
  const initialMinutes = initialOptions.initialMinutes ?? 25;
  const onTimeUp = initialOptions.onTimeUp;
  
  // Convert minutes to seconds for internal use
  const initialDuration = initialMinutes * 60;

  const initialState: TimerState = {
    timeLeft: initialDuration,
    isRunning: false,
    isPaused: false,
    showCompletion: false,
    completionCelebrated: false,
    metrics: {
      startTime: null,
      endTime: null,
      pauseCount: 0,
      expectedTime: initialDuration,
      actualDuration: 0,
      favoriteQuotes: [] as string[],
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: 'Completed On Time',
      isPaused: false,
      pausedTimeLeft: null,
      completionDate: undefined,
      taskId: undefined
    }
  };

  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const lastTickTime = useRef<number>(Date.now());

  // Set mounted ref to false on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Clear any interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Improved start/stop timer logic with better cleanup
  useEffect(() => {
    logger.debug('TimerCore', `Timer running state changed: isRunning=${state.isRunning}, timeLeft=${state.timeLeft}`);
    
    // Clear any existing interval to prevent multiple intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (state.isRunning && isMountedRef.current) {
      logger.debug('TimerCore', "Setting up timer interval");
      lastTickTime.current = Date.now(); // Track when the interval starts
      
      // Set up new interval to decrement time
      intervalRef.current = setInterval(() => {
        // Ensure we're mounted before updating state
        if (!isMountedRef.current) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        
        // Ensure we're only decrementing once per second, regardless of CPU load
        const now = Date.now();
        const elapsed = now - lastTickTime.current;
        if (elapsed >= 1000) { // Only tick if at least 1 second has passed
          lastTickTime.current = now;
          
          // Debug logging
          logger.debug('TimerCore', `Timer tick: ${state.timeLeft - 1}s remaining`);
          
          // Decrement the timer
          dispatch({ type: 'DECREMENT_TIME' });
          
          // Emit tick event for any listeners
          eventManager.emit('timer:tick', { 
            timeLeft: state.timeLeft - 1,
            taskName: 'timer'  // Generic taskName as this is a core hook
          });
          
          // Also dispatch a window event for backward compatibility
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('timer:tick', { 
              detail: { timeLeft: state.timeLeft - 1 } 
            });
            window.dispatchEvent(event);
          }
        }
      }, 100); // Run more frequently but only update when 1 second has passed
    }
  
    // Clean up interval on effect cleanup or component unmount
    return () => {
      if (intervalRef.current) {
        logger.debug('TimerCore', "Cleanup: clearing timer interval");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, state.timeLeft]);

  // Handle time up
  useEffect(() => {
    if (state.timeLeft === 0 && onTimeUp && isMountedRef.current) {
      logger.debug('TimerCore', "Timer reached zero, calling onTimeUp");
      onTimeUp();
    }
  }, [state.timeLeft, onTimeUp]);

  return {
    state,
    dispatch,
    intervalRef,
    isMountedRef
  };
};
