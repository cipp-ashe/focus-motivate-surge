import { TaskSummary, DailySummary } from "../types/summary";
import { Quote, TimerMetrics } from "../types/timer";

export const formatDailySummary = (
  completedTasks: TaskSummary[],
  unfinishedTasks: TaskSummary[],
  favoriteQuotes: Quote[]
): DailySummary => {
  const totalTimeSpent = completedTasks.reduce((total, task) => {
    return total + (task.metrics?.actualDuration || 0);
  }, 0);

  return {
    date: new Date().toISOString(),
    completedTasks,
    unfinishedTasks,
    totalTimeSpent,
    favoriteQuotes,
  };
};