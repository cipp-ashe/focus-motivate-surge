
// Timer state and action types
import { TimerStateMetrics } from '../metrics';

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  showCompletion: boolean;
  completionCelebrated: boolean;
  metrics: TimerStateMetrics;
}

export type TimerAction =
  | { type: 'INIT'; payload: { duration: number } }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'COMPLETE' }
  | { type: 'CELEBRATE' }
  | { type: 'UPDATE_METRICS'; payload: Partial<TimerStateMetrics> }
  | { type: 'DECREMENT_TIME' }
  | { type: 'SET_START_TIME'; payload: Date }
  | { type: 'SET_LAST_PAUSE_TIMESTAMP'; payload: Date }
  | { type: 'SET_EXTENSION_TIME'; payload: number }
  | { type: 'EXTEND'; payload: number };
