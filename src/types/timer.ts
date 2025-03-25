
import { TimerStateMetrics } from './metrics';
import { QuoteCategory, Quote, SoundOption, TaskType, TaskStatus } from './timer/models';

/**
 * Timer Types
 */

// Re-export the types from models for backward compatibility
export type { QuoteCategory, Quote, SoundOption, TaskType, TaskStatus };

// Timer state metrics
export { type TimerStateMetrics };

// Timer state
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  minutes: number;
  internalMinutes: number;
  showCompletion: boolean;
  showConfirmation: boolean;
  isExpanded: boolean;
  selectedSound: SoundOption;
  completionCelebrated: boolean;
  completionMetrics: any | null;
  
  // These were missing in TimerState but referenced
  timeLeft: number;
  metrics: TimerStateMetrics;
}

// Timer action
export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'UPDATE_TIME_LEFT'; payload: number }
  | { type: 'UPDATE_MINUTES'; payload: number }
  | { type: 'UPDATE_INTERNAL_MINUTES'; payload: number }
  | { type: 'UPDATE_METRICS'; payload: Partial<TimerStateMetrics> }
  | { type: 'SET_EXPANDED'; payload: boolean }
  | { type: 'SET_SELECTED_SOUND'; payload: SoundOption }
  | { type: 'SET_SHOW_COMPLETION'; payload: boolean }
  | { type: 'SET_SHOW_CONFIRMATION'; payload: boolean }
  | { type: 'SET_COMPLETION_METRICS'; payload: any }
  | { type: 'SET_PAUSED_TIME_LEFT'; payload: number }
  | { type: 'SET_COMPLETION_CELEBRATED'; payload: boolean };

// Timer expanded view ref type
export interface TimerExpandedViewRef {
  toggleExpansion: () => void;
  isExpanded: boolean;
  expand?: () => void;
  collapse?: () => void;
  saveNotes?: () => void;
  notesRef?: React.RefObject<HTMLTextAreaElement>;
  handleSave?: () => void;
}

// Timer view props extended by TimerBody
export interface TimerCircleProps {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  percentage?: number;
  isComplete?: boolean;
  isPaused?: boolean;
  duration?: number;
  taskName?: string;
}
