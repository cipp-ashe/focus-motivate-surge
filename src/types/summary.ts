import { Quote } from "./timer";
import { TimerMetrics } from "./metrics";

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
  totalPlannedTime: number;
  totalPauses: number;
  averageEfficiency: number;
  favoriteQuotes: Quote[];
}