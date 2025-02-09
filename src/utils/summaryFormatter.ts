import { TaskSummary, DailySummary, NotesSummary } from "../types/summary";
import { Quote } from "../types/timer";
import { TimerMetrics } from "../types/metrics";
import { Note } from "@/types/notes";

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
    if (metric.expectedTime === 0 || metric.netEffectiveTime === 0) return acc;
    // Calculate efficiency as defined in TimerMetrics type
    return acc + Math.min((metric.netEffectiveTime / metric.expectedTime) * 100, 200); // Cap at 200% efficiency
  }, 0);
  
  return Math.round(totalEfficiency / metrics.length);
};

export const formatNotesSummary = (notes: Note[]): NotesSummary => {
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));
  
  return {
    notes,
    tags: allTags,
    totalNotes: notes.length
  };
};

export const formatDailySummary = (
  completedTasks: TaskSummary[],
  unfinishedTasks: TaskSummary[],
  favoriteQuotes: Quote[],
  notes?: Note[]
): DailySummary => {
  const metrics = completedTasks
    .map(task => task.metrics)
    .filter((metrics): metrics is TimerMetrics => metrics !== undefined);

  const formattedCompletedTasks = completedTasks.map(task => ({
    ...task,
    formattedMetrics: task.metrics ? {
      plannedDuration: formatDuration(task.metrics.expectedTime),
      actualDuration: formatDuration(task.metrics.actualDuration),
      netEffectiveTime: formatDuration(task.metrics.netEffectiveTime),
      efficiency: task.metrics.efficiencyRatio,
      pauseCount: task.metrics.pauseCount,
      favoriteQuotes: task.metrics.favoriteQuotes || [],
    } : null
  }));

  return {
    date: new Date().toISOString(),
    completedTasks: formattedCompletedTasks,
    unfinishedTasks,
    totalTimeSpent: metrics.reduce((total, metric) => total + (metric.actualDuration || 0), 0),
    totalPlannedTime: metrics.reduce((total, metric) => total + (metric.expectedTime || 0), 0),
    totalPauses: metrics.reduce((total, metric) => total + (metric.pauseCount || 0), 0),
    averageEfficiency: calculateEfficiency(metrics),
    favoriteQuotes,
    notes: notes ? formatNotesSummary(notes) : undefined,
  };
};
