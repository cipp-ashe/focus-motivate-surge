
import { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { TimerState, TimerAction } from '@/types/timer/index';
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
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear any interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Fixed timer functionality - ensure proper countdown
  useEffect(() => {
    logger.debug('TimerCore', `Timer running state changed: isRunning=${state.isRunning}, timeLeft=${state.timeLeft}`);
    
    // Clear any existing interval to prevent multiple intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (state.isRunning && state.timeLeft > 0) {
      logger.debug('TimerCore', "Setting up timer interval");
      lastTickTime.current = Date.now(); // Track when the interval starts
      
      // Set up a more reliable ticker
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        
        const now = Date.now();
        const elapsed = now - lastTickTime.current;
        
        // Only decrement if at least 1 second has passed
        if (elapsed >= 1000) {
          lastTickTime.current = now - (elapsed % 1000); // Account for any extra time
          
          // Log the timer tick
          logger.debug('TimerCore', `Timer tick: ${state.timeLeft - 1}s remaining`);
          
          // Dispatch the decrement action
          dispatch({ type: 'DECREMENT_TIME' });
          
          // Emit the timer tick event
          eventManager.emit('timer:tick', { 
            timeLeft: state.timeLeft - 1,
            taskName: 'timer'
          });
        }
      }, 100); // Check more frequently but only update once per second
    } else if (state.timeLeft === 0 && state.isRunning) {
      // Handle timer completion when it reaches zero
      dispatch({ type: 'COMPLETE' });
      if (onTimeUp) {
        logger.debug('TimerCore', "Timer reached zero, calling onTimeUp");
        onTimeUp();
      }
    }
  
    // Clean up interval on effect cleanup
    return () => {
      if (intervalRef.current) {
        logger.debug('TimerCore', "Cleanup: clearing timer interval");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, state.timeLeft, onTimeUp]);

  return {
    state,
    dispatch,
    intervalRef,
    isMountedRef
  };
};
