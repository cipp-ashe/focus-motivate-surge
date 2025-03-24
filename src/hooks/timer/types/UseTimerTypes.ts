
import { TimerStateMetrics } from '@/types/metrics';
import { TimerState, TimerAction } from '@/types/timer/index';
import { Dispatch } from 'react';

/**
 * Options for initializing the useTimer hook
 */
export interface UseTimerOptions {
  initialMinutes?: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
  taskId?: string;
  taskName?: string;
}

/**
 * Return type for the useTimer hook
 */
export interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerStateMetrics;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => Promise<void>;
}

/**
 * Props for the timer actions hook with legacy interface
 */
export interface TimerActionProps {
  timeLeft: number;
  metrics: TimerStateMetrics;
  updateTimeLeft: (timeLeft: number) => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setIsRunning: (isRunning: boolean) => void;
  taskName?: string;
}

/**
 * Props for the timer actions hook with reducer interface
 */
export interface UseTimerActionsProps {
  dispatch: Dispatch<TimerAction>;
  state: TimerState;
  resetTimer?: () => Promise<void>;
  extendTimer?: (minutes: number) => void;
  setMinutes?: (minutes: number) => void;
  taskName?: string;
}

/**
 * Return type for the timer actions hook
 */
export interface UseTimerActionsReturn {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => Promise<void>;
  extendTimer: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => Promise<void>;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
}
