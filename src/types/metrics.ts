export interface TimerMetrics {
  startTime: Date | null;
  endTime: Date | null;
  pauseCount: number;
  originalDuration: number;
  actualDuration: number;
  favoriteQuotes: number;
}

export interface MetricsDisplayProps {
  metrics: TimerMetrics;
  taskName: string;
}