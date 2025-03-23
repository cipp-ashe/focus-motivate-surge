
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
  actualTime?: number; // Added for compatibility
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
  expectedTime?: number; // Added for compatibility
  actualTime?: number; // Added for compatibility
  netEffectiveTime?: number; // Added for compatibility
  efficiencyRatio?: number; // Added for compatibility
  completionStatus?: string; // Added for compatibility
  [key: string]: any;
}

/**
 * Convert TimerStateMetrics to TaskMetrics
 */
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
    // Add taskId if available
    ...(timerMetrics.taskId ? { taskId: timerMetrics.taskId } : {})
  };
};

/**
 * Convert TaskMetrics to TimerStateMetrics
 */
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
    // Default values for required fields
    lastPauseTimestamp: null,
    isPaused: false,
    pausedTimeLeft: null,
    taskId: taskMetrics.taskId
  };
};
