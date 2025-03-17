
import { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { TimerState, TimerAction } from '@/types/timer';
import { timerReducer } from './useTimerReducer';
import { UseTimerOptions } from './types/UseTimerTypes';

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
      completionDate: undefined
    }
  };

  const [state, dispatch] = useReducer(timerReducer, initialState);
  // Using MutableRefObject to fix the TypeScript error
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

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
    console.log(`Timer running state changed: isRunning=${state.isRunning}, timeLeft=${state.timeLeft}`);
    
    // Clear any existing interval to prevent multiple intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (state.isRunning && isMountedRef.current) {
      console.log("Setting up timer interval");
      
      // Set up new interval to decrement time
      intervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          console.log(`Timer tick: ${state.timeLeft - 1}s`);
          dispatch({ type: 'DECREMENT_TIME' });
          
          // Emit tick event for any listeners
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('timer:tick', { 
              detail: { timeLeft: state.timeLeft - 1 } 
            });
            window.dispatchEvent(event);
          }
        } else {
          // If component unmounted but interval somehow still running, clear it
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 1000);
    }
  
    // Clean up interval on effect cleanup or component unmount
    return () => {
      if (intervalRef.current) {
        console.log("Cleanup: clearing timer interval");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, state.timeLeft]);

  // Handle time up
  useEffect(() => {
    if (state.timeLeft === 0 && onTimeUp && isMountedRef.current) {
      console.log("Timer reached zero, calling onTimeUp");
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
