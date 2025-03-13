
import { TimerState, TimerAction } from '@/types/timer';

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        timeLeft: action.payload.duration,
        metrics: {
          ...state.metrics,
          expectedTime: action.payload.duration
        }
      };
    case 'START':
      // Start the timer if it's not already running
      return {
        ...state,
        isRunning: true,
        isPaused: false,
        metrics: {
          ...state.metrics,
          isPaused: false
        }
      };
    case 'PAUSE':
      // Pause the timer if it's running
      return {
        ...state,
        isPaused: true,
        metrics: {
          ...state.metrics,
          pauseCount: state.metrics.pauseCount + 1,
          isPaused: true
        }
      };
    case 'RESET':
      // Reset the timer
      return {
        ...state,
        timeLeft: state.metrics.expectedTime,
        isRunning: false,
        isPaused: false,
        showCompletion: false,
        completionCelebrated: false,
        metrics: {
          ...state.metrics,
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
      return {
        ...state,
        isRunning: false,
        isPaused: false,
        showCompletion: true,
        metrics: {
          ...state.metrics,
          isPaused: false
        }
      };
    case 'CELEBRATE':
      return {
        ...state,
        completionCelebrated: true
      };
    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          ...action.payload
        }
      };
    case 'DECREMENT_TIME':
      if (state.timeLeft <= 1) {
        // Auto-complete when time is up
        return {
          ...state,
          timeLeft: 0,
          isRunning: false,
          showCompletion: true
        };
      }
      
      return {
        ...state,
        timeLeft: state.timeLeft - 1
      };
    case 'SET_START_TIME':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          startTime: action.payload
        }
      };
    case 'SET_LAST_PAUSE_TIMESTAMP':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          lastPauseTimestamp: action.payload
        }
      };
    case 'SET_EXTENSION_TIME':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          extensionTime: state.metrics.extensionTime + action.payload
        }
      };
    case 'EXTEND':
      return {
        ...state,
        timeLeft: state.timeLeft + action.payload
      };
    default:
      return state;
  }
};
