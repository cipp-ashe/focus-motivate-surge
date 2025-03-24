
// Consolidated timer type definitions
import { TimerState as TimerStateBase, TimerAction as TimerActionBase, TimerMetrics } from './timer/state';
import { 
  TimerDisplayProps, 
  TimerControlsProps, 
  TimerProgressProps, 
  TimerSessionProps,
  TimerMetricsDisplayProps,
  TimerPresetDuration,
  TimerPresetsProps
} from './timer/ui';
import { TimerExpandedViewRef } from './timer/views';
import { SoundOption, Quote, QuoteCategory } from './timer/models';
import { 
  TimerCircleProps,
  MinutesInputProps,
  TimerA11yProps,
  ButtonA11yProps,
  SoundSelectorProps,
  TimerProps
} from './timer/components';

// Timer modes
export type TimerMode = 'focus' | 'pomodoro' | 'countdown' | 'stopwatch';

// Timer status
export type TimerStatus = 'idle' | 'active' | 'paused' | 'completed';

// Export all timer types from a single location
export type {
  // Base state definitions
  TimerStateBase,
  TimerActionBase,
  TimerMetrics,
  
  // UI component props
  TimerDisplayProps,
  TimerControlsProps,
  TimerProgressProps,
  TimerSessionProps,
  TimerMetricsDisplayProps,
  TimerPresetDuration,
  TimerPresetsProps,
  
  // Views
  TimerExpandedViewRef,
  
  // Models
  SoundOption,
  Quote,
  QuoteCategory,
  
  // Components
  TimerCircleProps,
  MinutesInputProps,
  TimerA11yProps,
  ButtonA11yProps,
  SoundSelectorProps,
  TimerProps
};

// Re-export the TimerState from index.ts
export type { TimerState, TimerAction } from './timer/index';
