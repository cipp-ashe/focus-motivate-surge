import { useState, useEffect, useCallback } from 'react';
import { TimerState, TimerStateMetrics } from '@/types/metrics';
import { TimerAction } from '@/types/timer';

interface TimerProps {
  initialMinutes: number;
}

type Dispatch<A> = (action: A) => void;

export const useTimer = (initialMinutes: number) => {
  const [state, setState] = useState<TimerState>({
    timeLeft: initialMinutes * 60,
    isRunning: false,
    isPaused: false,
    showCompletion: false,
    completionCelebrated: false,
    metrics: {
      startTime: null,
      endTime: null,
      pauseCount: 0,
      pausedTime: 0,
      expectedTime: initialMinutes * 60,
      actualDuration: 0,
      pausedTimeLeft: null,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: 'Completed On Time',
      favoriteQuotes: [], // Fix: Changed from number to string[]
      isPaused: false
    },
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.isRunning && state.timeLeft > 0) {
      intervalId = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timeLeft: prevState.timeLeft - 1,
          metrics: {
            ...prevState.metrics,
            actualDuration: prevState.metrics.actualDuration + 1,
            netEffectiveTime: prevState.metrics.netEffectiveTime + 1,
            efficiencyRatio: prevState.metrics.expectedTime === 0 ? 0 : Math.min((prevState.metrics.netEffectiveTime / prevState.metrics.expectedTime) * 100, 200),
          }
        }));
      }, 1000);
    } else if (state.timeLeft === 0 && state.isRunning) {
      setState(prevState => ({ ...prevState, isRunning: false, showCompletion: true }));
    }

    return () => clearInterval(intervalId);
  }, [state.isRunning, state.timeLeft]);

  const dispatch = useCallback((action: TimerAction) => {
    setState(prevState => {
      switch (action.type) {
        case 'INIT':
          return {
            ...prevState,
            timeLeft: action.payload.duration,
            metrics: {
              ...prevState.metrics,
              expectedTime: action.payload.duration,
            },
          };
        case 'START':
          return {
            ...prevState,
            isRunning: true,
            isPaused: false,
            metrics: {
              ...prevState.metrics,
              startTime: prevState.metrics.startTime || new Date().toISOString(),
            },
          };
        case 'PAUSE':
          return {
            ...prevState,
            isRunning: false,
            isPaused: true,
            metrics: {
              ...prevState.metrics,
              pauseCount: prevState.metrics.pauseCount + 1,
              lastPauseTimestamp: new Date().toISOString(),
              pausedTimeLeft: prevState.timeLeft,
              isPaused: true
            },
          };
        case 'RESET':
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
              expectedTime: prevState.metrics.expectedTime,
              actualDuration: 0,
              pausedTimeLeft: null,
              lastPauseTimestamp: null,
              extensionTime: 0,
              netEffectiveTime: 0,
              efficiencyRatio: 0,
              completionStatus: 'Completed On Time',
              favoriteQuotes: [],
              isPaused: false
            },
          };
        case 'COMPLETE':
          return {
            ...prevState,
            isRunning: false,
            showCompletion: true,
            metrics: {
              ...prevState.metrics,
              endTime: new Date().toISOString(),
            },
          };
        case 'CELEBRATE':
          return { ...prevState, completionCelebrated: true };
        case 'UPDATE_METRICS':
          return {
            ...prevState,
            metrics: {
              ...prevState.metrics,
              ...action.payload,
            },
          };
        case 'DECREMENT_TIME':
          return {
            ...prevState,
            timeLeft: prevState.timeLeft - 1,
          };
        default:
          return prevState;
      }
    });
  }, []);

  return { state, dispatch };
};
