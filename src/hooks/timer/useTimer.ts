
import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerStateMetrics } from '@/types/metrics';
import { TimerState, TimerAction } from '@/types/timer';

export const useTimer = (initialDuration: number = 1500) => {
  const [state, setState] = useState<TimerState>({
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
      pausedTimeLeft: null
    }
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate minutes from seconds
  const minutes = Math.floor(state.timeLeft / 60);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const dispatch = useCallback((action: TimerAction) => {
    setState(prevState => {
      switch (action.type) {
        case 'INIT':
          return {
            ...prevState,
            timeLeft: action.payload.duration,
            metrics: {
              ...prevState.metrics,
              expectedTime: action.payload.duration
            }
          };
        case 'START':
          // Start the timer if it's not already running
          if (!prevState.isRunning) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
              dispatch({ type: 'DECREMENT_TIME' });
            }, 1000);
            
            return {
              ...prevState,
              isRunning: true,
              isPaused: false,
              metrics: {
                ...prevState.metrics,
                isPaused: false
              }
            };
          }
          return prevState;
        case 'PAUSE':
          // Pause the timer if it's running
          if (prevState.isRunning && !prevState.isPaused) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            return {
              ...prevState,
              isPaused: true,
              metrics: {
                ...prevState.metrics,
                pauseCount: prevState.metrics.pauseCount + 1,
                isPaused: true
              }
            };
          }
          return prevState;
        case 'RESET':
          // Reset the timer
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          return {
            ...prevState,
            timeLeft: prevState.metrics.expectedTime,
            isRunning: false,
            isPaused: false,
            showCompletion: false,
            completionCelebrated: false,
            metrics: {
              ...prevState.metrics,
              startTime: null,
              endTime: null,
              pauseCount: 0,
              pausedTime: 0,
              lastPauseTimestamp: null,
              extensionTime: 0,
              isPaused: false
            }
          };
        case 'COMPLETE':
          // Complete the timer
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          return {
            ...prevState,
            isRunning: false,
            isPaused: false,
            showCompletion: true,
            metrics: {
              ...prevState.metrics,
              isPaused: false
            }
          };
        case 'CELEBRATE':
          return {
            ...prevState,
            completionCelebrated: true
          };
        case 'UPDATE_METRICS':
          return {
            ...prevState,
            metrics: {
              ...prevState.metrics,
              ...action.payload
            }
          };
        case 'DECREMENT_TIME':
          if (prevState.timeLeft <= 1) {
            // Auto-complete when time is up
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            return {
              ...prevState,
              timeLeft: 0,
              isRunning: false,
              showCompletion: true
            };
          }
          
          return {
            ...prevState,
            timeLeft: prevState.timeLeft - 1
          };
        case 'SET_START_TIME':
          return {
            ...prevState,
            metrics: {
              ...prevState.metrics,
              startTime: action.payload
            }
          };
        case 'SET_LAST_PAUSE_TIMESTAMP':
          return {
            ...prevState,
            metrics: {
              ...prevState.metrics,
              lastPauseTimestamp: action.payload
            }
          };
        case 'SET_EXTENSION_TIME':
          return {
            ...prevState,
            metrics: {
              ...prevState.metrics,
              extensionTime: prevState.metrics.extensionTime + action.payload
            }
          };
        case 'EXTEND':
          return {
            ...prevState,
            timeLeft: prevState.timeLeft + action.payload
          };
        default:
          return prevState;
      }
    });
  }, []);

  // Timer control methods
  const startTimer = useCallback(() => {
    dispatch({ type: 'START' });
    dispatch({ type: 'SET_START_TIME', payload: new Date() });
  }, [dispatch]);

  const pauseTimer = useCallback(() => {
    if (state.isRunning && !state.isPaused) {
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_LAST_PAUSE_TIMESTAMP', payload: new Date() });
    }
  }, [state.isRunning, state.isPaused, dispatch]);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const extendTimer = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    dispatch({ type: 'EXTEND', payload: seconds });
    dispatch({ type: 'SET_EXTENSION_TIME', payload: seconds });
  }, [dispatch]);

  const setMinutes = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    dispatch({ type: 'INIT', payload: { duration: seconds } });
  }, [dispatch]);

  const completeTimer = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
  }, [dispatch]);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics>) => {
    dispatch({ type: 'UPDATE_METRICS', payload: updates });
  }, [dispatch]);

  return {
    state,
    dispatch,
    timeLeft: state.timeLeft,
    minutes,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    showCompletion: state.showCompletion,
    completionCelebrated: state.completionCelebrated,
    metrics: state.metrics,
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    setMinutes,
    completeTimer,
    updateMetrics
  };
};
