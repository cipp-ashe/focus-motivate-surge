export interface TimerMetrics {
  startTime: Date | null;
  endTime: Date | null;
  pauseCount: number;
  originalDuration: number;
  actualDuration: number;
  favoriteQuotes: number;
  pausedTime: number;
  lastPauseTimestamp: Date | null;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
}

export interface MetricsDisplayProps {
  metrics: TimerMetrics;
  taskName: string;
}

export interface TimerStateMetrics extends TimerMetrics {
  isPaused: boolean;
  pausedTimeLeft: number | null;
}