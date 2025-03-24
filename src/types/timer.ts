
import { TimerStateMetrics } from './metrics';
import { Quote, SoundOption } from './timer/models';
import { TimerExpandedViewRef } from './timer/views';

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

// Re-export the standardized TimerState from index.ts
export { TimerState } from './timer/index';

// Re-export key types for backwards compatibility
export type { Quote, SoundOption } from './timer/models';
export type { TimerExpandedViewRef } from './timer/views';

export interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onAddTime: (minutes: number) => void;
  onToggle?: () => void;
  onComplete?: () => Promise<void>;
  disabled?: boolean;
  showAddTime?: boolean;
  size?: 'sm' | 'md' | 'lg';
  metrics?: TimerStateMetrics;
  pauseTimeLeft?: number | null;
}

export interface TimerCircleProps {
  percentage: number;
  timeLeft: number;
  duration: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  taskName: string;
}

export interface ExpandedViewProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  favorites: Quote[];
  onAddToFavorites: (quote: Quote) => void;
  onRemoveFromFavorites: (quoteId: string) => void;
  timerRef: React.RefObject<TimerExpandedViewRef>;
  quote: Quote | null;
  onNewQuote: () => void;
}

export interface TimerSoundProps {
  selectedSound: SoundOption;
  onSelectSound: (sound: SoundOption) => void;
  onTest: () => void;
  isLoading: boolean;
}

export interface SoundEffectOptions {
  volume?: number;
  loop?: boolean;
  onEnded?: () => void;
}

export interface TimerCompletionProps {
  metrics: TimerStateMetrics;
  taskName?: string;
  onComplete: () => void;
}
