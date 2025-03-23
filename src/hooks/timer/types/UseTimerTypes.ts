
import { TimerStateMetrics } from '@/types/metrics';
import { TimerAction, TimerState } from '@/types/timer/index';

export interface UseTimerOptions {
  initialMinutes?: number;
  onTimeUp?: () => void;
}

export interface UseTimerReturn {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  isPaused: boolean;
  showCompletion: boolean;
  completionCelebrated: boolean;
  metrics: TimerStateMetrics;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => Promise<void>;
  extendTimer: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => Promise<void>;
  updateMetrics: (updates: any) => void;
}

export interface UseTimerActionsProps {
  dispatch: React.Dispatch<TimerAction>;
  intervalRef?: React.MutableRefObject<NodeJS.Timeout | null>;
  resetTimer?: () => Promise<void>;
  extendTimer?: (minutes: number) => void;
  setMinutes?: (minutes: number) => void;
  updateMetrics?: (updates: any) => void;
}

export interface UseTimerActionsReturn {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => Promise<void>;
  extendTimer: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => Promise<void>;
  updateMetrics: (updates: any) => void;
}

// Legacy interface to support existing code during transition
export interface TimerActionProps {
  timeLeft: number;
  metrics: TimerStateMetrics;
  updateTimeLeft: (timeLeft: number) => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setIsRunning: (isRunning: boolean) => void;
  resetTimer?: () => Promise<void>;
  extendTimer?: (minutes: number) => void;
  setMinutes?: (minutes: number) => void;
}

// Handlers
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
  getTimerControlsProps: (size?: 'sm' | 'md' | 'lg') => any;
}
