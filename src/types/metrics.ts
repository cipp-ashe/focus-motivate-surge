
/**
 * Timer metrics types
 */

export interface TimerStateMetrics {
  startTime: string | null;
  endTime: string | null;
  completionDate: string | null;
  actualDuration: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  completionStatus: 'completed' | 'abandoned' | 'extended' | null;
  isPaused: boolean;
  taskId?: string;
  
  // Additional metrics properties
  expectedTime?: number;
  pauseCount?: number;
  lastPauseTimestamp?: string | null;
  favoriteQuotes?: string[];
  pausedTimeLeft?: number | null;
  efficiencyRatio?: number;
}

export interface TimerMetricsData {
  startTime: string;
  endTime: string;
  duration: number;
  pauseCount: number;
  pauseDuration: number;
  extensionCount: number;
  extensionDuration: number;
  taskId?: string;
  completed: boolean;
}
