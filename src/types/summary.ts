import { Quote, TimerMetrics } from "./timer";

export interface TaskSummary {
  taskName: string;
  completed: boolean;
  metrics?: TimerMetrics;
  relatedQuotes: Quote[];
}

export interface DailySummary {
  date: string;
  completedTasks: TaskSummary[];
  unfinishedTasks: TaskSummary[];
  totalTimeSpent: number;
  favoriteQuotes: Quote[];
}