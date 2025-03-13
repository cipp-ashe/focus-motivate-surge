
import { TimerStateMetrics } from '@/types/metrics';

export interface TimerHandlerFunctions {
  start: () => void;
  pause: () => void;
  reset: () => Promise<void>;
  addTime: (minutes: number) => void;
  completeTimer: () => Promise<void>;
}

export interface TimerCallbackFunctions {
  onAddTime?: (minutes: number) => void;
  onComplete?: (metrics: TimerStateMetrics) => void;
  onDurationChange?: (minutes: number) => void;
}

export interface TimerUIState {
  isExpanded: boolean;
  showCompletion: boolean;
  showConfirmation: boolean;
  completionMetrics: TimerStateMetrics | null;
  selectedSound: string;
  isLoadingAudio: boolean;
}

export interface TimerUIActions {
  setIsExpanded: (expanded: boolean) => void;
  setShowCompletion: (show: boolean) => void;
  setShowConfirmation: (show: boolean) => void;
  setCompletionMetrics: (metrics: any) => void;
  testSound: () => void;
  playSound: () => void;
}

export interface UseTimerHandlersReturn {
  handleToggle: () => void;
  handleAddTime: (minutes: number) => void;
  handleReset: () => Promise<void>;
  handleComplete: () => Promise<void>;
  handleClose: () => void;
  showResetConfirmation: () => void;
  handlePause: () => void;
}

export interface UseTimerViewReturn {
  getTimerCircleProps: () => any;
  getTimerControlsProps: (size?: 'normal' | 'large') => any;
}
