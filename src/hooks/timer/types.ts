
import { TimerStateMetrics } from '@/types/metrics';

// Re-export types from the detailed type file
export * from './types/UseTimerTypes';

// Legacy types for backward compatibility
export interface UseTimerLegacyOptions {
  initialMinutes?: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

export interface UseTimerLegacyReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerStateMetrics;
  updateMetrics: ((updates: Partial<TimerStateMetrics>) => void) & ((updater: (prev: TimerStateMetrics) => Partial<TimerStateMetrics>) => void);
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => void;
}
