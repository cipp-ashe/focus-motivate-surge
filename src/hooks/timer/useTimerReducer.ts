
import { TimerState, TimerAction } from '@/types/timer';
import { toISOString } from '@/lib/utils/dateUtils';
import { 
  determineCompletionStatus, 
  calculateEfficiencyRatio 
} from '@/lib/utils/formatters';

// Timer reducer to handle all timer state changes
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
      return {
        ...state,
        isRunning: true,
        isPaused: false
      };

    case 'PAUSE':
      return {
        ...state,
        isRunning: false,
        isPaused: true,
        metrics: {
          ...state.metrics,
          pauseCount: state.metrics.pauseCount + 1,
          isPaused: true,
          pausedTimeLeft: state.timeLeft
        }
      };

    case 'RESET':
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
          actualDuration: 0,
          pausedTime: 0,
          lastPauseTimestamp: null,
          extensionTime: 0,
          isPaused: false,
          pausedTimeLeft: null
        }
      };

    case 'COMPLETE': {
      const now = new Date();
      // Ensure we have a valid startTime, handle both Date and string types
      const startTime = state.metrics.startTime || new Date(now.getTime() - (state.metrics.expectedTime * 1000));
      // Calculate elapsed time correctly whether startTime is a Date or string
      const startTimeMs = startTime instanceof Date ? startTime.getTime() : new Date(startTime).getTime();
      const actualDuration = Math.floor((now.getTime() - startTimeMs) / 1000);
      const pausedTime = state.metrics.pausedTime || 0;
      const extensionTime = state.metrics.extensionTime || 0;
      const netEffectiveTime = Math.max(0, actualDuration - pausedTime + extensionTime);
      const efficiencyRatio = calculateEfficiencyRatio(state.metrics.expectedTime, netEffectiveTime);
      const completionStatus = determineCompletionStatus(state.metrics.expectedTime, netEffectiveTime);

      return {
        ...state,
        isRunning: false,
        isPaused: false,
        showCompletion: true,
        metrics: {
          ...state.metrics,
          // Ensure all dates are serialized to ISO strings
          startTime: startTime instanceof Date ? toISOString(startTime) : startTime,
          endTime: toISOString(now),
          actualDuration,
          pausedTime,
          extensionTime,
          netEffectiveTime,
          efficiencyRatio,
          completionStatus,
          isPaused: false,
          pausedTimeLeft: null,
          completionDate: toISOString(now)
        }
      };
    }

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
      // Don't go below zero
      if (state.timeLeft <= 0) {
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
          extensionTime: (state.metrics.extensionTime || 0) + action.payload
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
