import { TaskSummary, DailySummary } from "../types/summary";
import { Quote, TimerMetrics } from "../types/timer";

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};

const calculateEfficiency = (metrics: TimerMetrics[]): number => {
  if (metrics.length === 0) return 0;
  
  const totalEfficiency = metrics.reduce((acc, metric) => {
    if (metric.originalDuration === 0) return acc;
    return acc + (metric.originalDuration / metric.actualDuration) * 100;
  }, 0);
  
  return Math.round(totalEfficiency / metrics.length);
};

export const formatDailySummary = (
  completedTasks: TaskSummary[],
  unfinishedTasks: TaskSummary[],
  favoriteQuotes: Quote[]
): DailySummary => {
  console.log('Summary Formatter - Input tasks:', completedTasks.map(task => ({
    taskName: task.taskName,
    metrics: task.metrics ? {
      originalDuration: task.metrics.originalDuration,
      actualDuration: task.metrics.actualDuration,
      netEffectiveTime: task.metrics.netEffectiveTime,
      efficiencyRatio: task.metrics.efficiencyRatio
    } : null
  })));

  const metrics = completedTasks
    .map(task => task.metrics)
    .filter((metrics): metrics is TimerMetrics => metrics !== undefined);

  console.log('Summary Formatter - Filtered metrics:', metrics.map(m => ({
    originalDuration: m.originalDuration,
    actualDuration: m.actualDuration,
    netEffectiveTime: m.netEffectiveTime,
    efficiencyRatio: m.efficiencyRatio
  })));

  const totalTimeSpent = metrics.reduce((total, metric) => {
    return total + (metric.actualDuration || 0);
  }, 0);

  const totalPlannedTime = metrics.reduce((total, metric) => {
    return total + (metric.originalDuration || 0);
  }, 0);

  const totalPauses = metrics.reduce((total, metric) => {
    return total + (metric.pauseCount || 0);
  }, 0);

  const averageEfficiency = calculateEfficiency(metrics);

  const formattedCompletedTasks = completedTasks.map(task => ({
    ...task,
    formattedMetrics: task.metrics ? {
      plannedDuration: formatDuration(task.metrics.originalDuration),
      actualDuration: formatDuration(task.metrics.actualDuration),
      efficiency: Math.round((task.metrics.originalDuration / task.metrics.actualDuration) * 100),
      pauseCount: task.metrics.pauseCount,
      favoriteQuotes: task.metrics.favoriteQuotes,
    } : null
  }));

  return {
    date: new Date().toISOString(),
    completedTasks: formattedCompletedTasks,
    unfinishedTasks,
    totalTimeSpent,
    totalPlannedTime,
    totalPauses,
    averageEfficiency,
    favoriteQuotes,
  };
};