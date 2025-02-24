
import { TimerMetrics } from '@/types/metrics';

export interface UseTimerOptions {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

export interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerMetrics;
  updateMetrics: ((updates: Partial<TimerMetrics>) => void) & ((updater: (prev: TimerMetrics) => Partial<TimerMetrics>) => void);
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => void;
}

export interface UseTimerActionsReturn {
  setMinutes: (newMinutes: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (additionalMinutes: number) => void;
  completeTimer: () => void;
}
