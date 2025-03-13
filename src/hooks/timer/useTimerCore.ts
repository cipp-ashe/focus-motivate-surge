
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Start/stop timer logic
  useEffect(() => {
    if (state.isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'DECREMENT_TIME' });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  // Handle time up
  useEffect(() => {
    if (state.timeLeft === 0 && onTimeUp) {
      onTimeUp();
    }
  }, [state.timeLeft, onTimeUp]);

  return {
    state,
    dispatch,
    intervalRef,
  };
};
