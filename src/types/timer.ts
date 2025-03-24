
/**
 * Unified Timer Type System
 * Single source of truth for all timer-related types
 */

import { TaskMetrics } from './task';

// Timer modes
export type TimerMode = 'focus' | 'pomodoro' | 'countdown' | 'stopwatch';

// Timer status
export type TimerStatus = 'idle' | 'active' | 'paused' | 'completed';

// Sound options
export type SoundOption = 'bell' | 'chime' | 'gong' | 'notification' | 'success' | 'none';

// Quote categories
export type QuoteCategory = 
  | 'motivation' | 'productivity' | 'focus' | 'success' | 'wisdom' | 'general'
  | 'persistence' | 'growth' | 'creativity' | 'learning' | 'gratitude' 
  | 'reflection' | 'mindfulness';

// Quote interface
export interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
  category?: QuoteCategory | QuoteCategory[];
  task?: string;
  timestamp?: string;
}

// Timer constants
export const TIMER_CONSTANTS = {
  DEFAULT_DURATION_MINUTES: 25,
  MIN_DURATION_MINUTES: 1,
  MAX_DURATION_MINUTES: 120,
  DEFAULT_SOUND: 'bell',
  ADD_TIME_MINUTES: 5
};

export const SOUND_OPTIONS = [
  { value: 'bell', label: 'bell' },
  { value: 'chime', label: 'chime' },
  { value: 'gong', label: 'gong' },
  { value: 'notification', label: 'notification' },
  { value: 'success', label: 'success' },
  { value: 'none', label: 'no sound' }
];

// Timer state interface
export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  showCompletion: boolean;
  completionCelebrated: boolean;
  metrics: TimerStateMetrics;
}

// Timer action type
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

// Timer metrics interface
export interface TimerStateMetrics {
  startTime: string | Date | null;
  endTime: string | Date | null;
  pauseCount: number;
  expectedTime: number;
  actualDuration: number;
  pausedTime: number;
  lastPauseTimestamp: string | Date | null;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: string;
  favoriteQuotes?: string[];
  isPaused: boolean;
  pausedTimeLeft: number | null;
  completionDate?: string;
  taskId?: string;
  actualTime?: number; // Added for compatibility
}

// Alias for compatibility with existing code
export type TimerMetrics = TimerStateMetrics;

// Helper functions to convert between timer and task metrics
export const convertTimerMetricsToTaskMetrics = (
  timerMetrics: TimerStateMetrics
): TaskMetrics => {
  return {
    startTime: timerMetrics.startTime,
    endTime: timerMetrics.endTime,
    completionDate: timerMetrics.completionDate,
    actualDuration: timerMetrics.actualDuration,
    pauseCount: timerMetrics.pauseCount,
    pausedTime: timerMetrics.pausedTime,
    extensionTime: timerMetrics.extensionTime,
    expectedTime: timerMetrics.expectedTime,
    netEffectiveTime: timerMetrics.netEffectiveTime,
    efficiencyRatio: timerMetrics.efficiencyRatio,
    completionStatus: timerMetrics.completionStatus,
    ...(timerMetrics.taskId ? { taskId: timerMetrics.taskId } : {})
  };
};

export const convertTaskMetricsToTimerMetrics = (
  taskMetrics: TaskMetrics
): Partial<TimerStateMetrics> => {
  return {
    startTime: taskMetrics.startTime || null,
    endTime: taskMetrics.endTime || null,
    pauseCount: taskMetrics.pauseCount || 0,
    expectedTime: taskMetrics.expectedTime || taskMetrics.duration || 0,
    actualDuration: taskMetrics.actualDuration || 0,
    pausedTime: taskMetrics.pausedTime || 0,
    extensionTime: taskMetrics.extensionTime || 0,
    netEffectiveTime: taskMetrics.netEffectiveTime || 0,
    efficiencyRatio: taskMetrics.efficiencyRatio || 1.0,
    completionStatus: taskMetrics.completionStatus || 'Completed',
    completionDate: taskMetrics.completionDate?.toString() || undefined,
    lastPauseTimestamp: null,
    isPaused: false,
    pausedTimeLeft: null,
    taskId: taskMetrics.taskId as string | undefined
  };
};

// Timer expanded view ref interface
export interface TimerExpandedViewRef {
  expand: () => void;
  collapse: () => void;
  toggleExpansion: () => void;
  isExpanded: boolean;
  saveNotes?: () => void;
  notesRef?: React.RefObject<HTMLTextAreaElement>;
  handleSave?: () => void;
}

// Timer UI component props interfaces
export interface TimerDisplayProps {
  timeLeft: number;
  duration: number;
  isActive: boolean;
  isPaused: boolean;
  taskName: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onComplete: () => void;
}

export interface TimerControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onComplete: () => void;
  onExtend: (minutes: number) => void;
}

export interface TimerProgressProps {
  timeLeft: number;
  duration: number;
  isActive: boolean;
  isPaused: boolean;
}

export interface TimerSessionProps {
  taskId?: string;
  taskName: string;
  duration: number;
  onSessionComplete: (metrics: any) => void;
  onSessionCancel: () => void;
}

export interface TimerMetricsDisplayProps {
  metrics: {
    startTime?: string;
    endTime?: string;
    expectedTime?: number;
    actualDuration?: number;
    pauseCount?: number;
    pausedTime?: number;
    extensionTime?: number;
    netEffectiveTime?: number;
    efficiencyRatio?: number;
  };
}

export type TimerPresetDuration = 5 | 15 | 25 | 30 | 45 | 60 | 90 | 120;

export interface TimerPresetsProps {
  onSelectPreset: (duration: number) => void;
  currentDuration: number;
}

// Timer component props
export interface TimerCircleProps {
  percentage?: number;
  timeLeft: number;
  duration?: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete?: boolean;
  taskName?: string;
  size?: 'normal' | 'large';
  circumference?: number;
  a11yProps?: React.AriaAttributes;
  onClick?: () => void;
}

export interface MinutesInputProps {
  minutes: number;
  onMinutesChange: (minutes: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
  onBlur?: () => void;
}

export interface TimerA11yProps {
  ariaLabel?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaAtomic?: boolean;
}

export interface ButtonA11yProps {
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
}

export interface SoundSelectorProps {
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio?: boolean;
}

export interface TimerProps {
  duration: number;
  taskName: string;
  taskId?: string;
  onComplete?: (metrics: TimerStateMetrics) => void;
  onAddTime?: (minutes: number) => void;
  onDurationChange?: (minutes: number) => void;
  favorites?: Quote[];
  setFavorites?: React.Dispatch<React.SetStateAction<Quote[]>>;
}
