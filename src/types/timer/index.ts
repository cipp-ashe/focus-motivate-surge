
// Re-export component types
export type {
  TimerA11yProps,
  ButtonA11yProps,
  TimerProps,
  TimerCircleProps,
  TimerControlsProps,
  MinutesInputProps,
  SoundOption,
  SoundSelectorProps,
  TimerExpandedViewRef,
} from './components';

// Re-export constants
export { TIMER_CONSTANTS, SOUND_OPTIONS } from './constants';

// Re-export model types
export type { QuoteCategory, Quote } from './models';

// Timer state and action types
export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  showCompletion: boolean;
  completionCelebrated: boolean;
  metrics: import('../metrics').TimerStateMetrics;
}

export type TimerAction =
  | { type: 'INIT'; payload: { duration: number } }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'COMPLETE' }
  | { type: 'CELEBRATE' }
  | { type: 'UPDATE_METRICS'; payload: Partial<import('../metrics').TimerStateMetrics> }
  | { type: 'DECREMENT_TIME' }
  | { type: 'SET_START_TIME'; payload: Date }
  | { type: 'SET_LAST_PAUSE_TIMESTAMP'; payload: Date }
  | { type: 'SET_EXTENSION_TIME'; payload: number }
  | { type: 'EXTEND'; payload: number };
