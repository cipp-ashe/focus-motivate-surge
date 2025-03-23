
/**
 * Metrics for tracking timer state
 */
export interface TimerStateMetrics {
  startTime: string | Date | null;
  endTime: string | Date | null;
  pauseCount: number;
  expectedTime: number;
  actualDuration: number;
  pausedTime: number;
  lastPauseTimestamp: Date | null;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: string;
  favoriteQuotes?: string[];
  isPaused: boolean;
  pausedTimeLeft: number | null;
  completionDate?: string;
  taskId?: string;
}

/**
 * Task completion metrics
 */
export interface TaskMetrics {
  startTime?: string | Date;
  endTime?: string | Date;
  completionDate?: string | Date;
  duration?: number;
  actualDuration?: number;
  pauseCount?: number;
  pausedTime?: number;
  extensionTime?: number;
  notes?: string;
  tags?: string[];
  difficulty?: number;
  satisfaction?: number;
  energy?: number;
  focus?: number;
  distractions?: number;
  [key: string]: any;
}
