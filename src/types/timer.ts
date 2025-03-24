
/**
 * Timer Types
 */

// Timer state metrics
export interface TimerStateMetrics {
  startTime: string;
  endTime: string | null;
  completionDate: string | null;
  actualDuration: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  completionStatus: 'completed' | 'abandoned' | 'extended' | null;
  isPaused: boolean;
  taskId?: string;
  
  // Additional metrics properties needed by components
  expectedTime?: number;
  pauseCount?: number;
  lastPauseTimestamp?: string;
  favoriteQuotes?: string[];
  pausedTimeLeft?: number;
  efficiencyRatio?: number;
}

// Sound options
export type SoundOption = 'bell' | 'chime' | 'ding' | 'beep' | 'success' | 'none';

// Quote category
export type QuoteCategory = 
  | 'motivation'
  | 'focus'
  | 'productivity'
  | 'success'
  | 'mindfulness'
  | 'creativity'
  | 'learning';

// Quote type
export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory | QuoteCategory[];
  favorite?: boolean;
}

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
}

// Timer view props extended by TimerBody
export interface TimerCircleProps {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  percentage?: number;
  isComplete?: boolean;
  taskName?: string;
}
