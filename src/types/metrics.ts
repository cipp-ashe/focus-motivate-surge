
export interface TimerMetrics {
  startTime: Date | string | null;
  endTime: Date | string | null;
  pauseCount: number;
  expectedTime: number;  // Renamed from originalDuration for clarity
  actualDuration: number;
  favoriteQuotes: string[]; // Changed from number to string[] to match TaskMetrics
  pausedTime: number;
  lastPauseTimestamp: Date | string | null;
  extensionTime: number;
  netEffectiveTime: number;  // Computed as: actualDuration - pausedTime + extensionTime
  efficiencyRatio: number;   // Computed as: (expectedTime / netEffectiveTime) * 100
  completionStatus: string;  // Changed to string to be more flexible
  isPaused: boolean;
  pausedTimeLeft: number | null;
  completionDate?: string; // Added to match usage in ScreenshotTask
  taskId?: string; // Adding this to support storing taskId in metrics
}

export interface MetricsDisplayProps {
  metrics: TimerMetrics;
  taskName: string;
}

export type TimerStateMetrics = TimerMetrics;
