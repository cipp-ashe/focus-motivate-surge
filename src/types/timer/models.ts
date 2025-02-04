export type QuoteCategory = 'progress' | 'productivity' | 'growth' | 'creativity' | 'learning';

export interface Quote {
  id: string;
  text: string;
  author: string;
  categories: QuoteCategory[];
  task?: string;
  timestamp?: Date;
}

export interface TaskMetrics {
  expectedTime: number;
  actualDuration: number;
  pauseCount: number;
  favoriteQuotes: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
}

export interface TimerMetrics extends TaskMetrics {
  startTime: Date | null;
  endTime: Date | null;
  lastPauseTimestamp: Date | null;
}

export interface TimerStateMetrics extends TimerMetrics {
  isPaused: boolean;
  pausedTimeLeft: number | null;
}

export interface MetricsDisplayProps {
  metrics: TimerMetrics;
  taskName: string;
}
