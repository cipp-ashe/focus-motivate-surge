
// Consolidated timer type definitions
import { TimerMetrics, TimerState, TimerAction } from './timer/state';
import { TimerDisplayProps, TimerControlsProps, TimerProgressProps, TimerSessionProps, TimerMetricsDisplayProps, TimerPresetDuration, TimerPresetsProps } from './timer/ui';

// Re-export types for easier imports elsewhere
export type {
  TimerMetrics,
  TimerState,
  TimerAction,
  TimerDisplayProps,
  TimerControlsProps,
  TimerProgressProps,
  TimerSessionProps,
  TimerMetricsDisplayProps,
  TimerPresetDuration,
  TimerPresetsProps
};

// Timer modes
export type TimerMode = 'focus' | 'pomodoro' | 'countdown' | 'stopwatch';

// Timer status
export type TimerStatus = 'idle' | 'active' | 'paused' | 'completed';

// Added Quote related types since they're used in the timer
export interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
  category: QuoteCategory;
}

export type QuoteCategory = 
  | 'focus' 
  | 'motivation' 
  | 'productivity' 
  | 'wisdom'
  | 'mindfulness'
  | 'gratitude'
  | 'reflection';

