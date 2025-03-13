
import { TaskSummary, DailySummary, NotesSummary } from "../types/summary";
import { Quote } from "../types/timer";
import { TimerMetrics } from "../types/metrics";
import { Note } from "@/types/notes";
import { formatDuration, calculateEfficiencyPercentage } from "@/lib/utils/formatters";

export const formatNotesSummary = (notes: Note[]): NotesSummary => {
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags.map(tag => tag.name))));
  
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
      favoriteQuotes: task.metrics.favoriteQuotes ? 
        (Array.isArray(task.metrics.favoriteQuotes) ? 
          task.metrics.favoriteQuotes.map(quote => 
            typeof quote === 'string' ? { text: quote, author: '', categories: [] } : quote
          ) : []) : [],
    } : null
  }));

  return {
    date: new Date().toISOString(),
    completedTasks: formattedCompletedTasks,
    unfinishedTasks,
    totalTimeSpent: metrics.reduce((total, metric) => total + (metric.actualDuration || 0), 0),
    totalPlannedTime: metrics.reduce((total, metric) => total + (metric.expectedTime || 0), 0),
    totalPauses: metrics.reduce((total, metric) => total + (metric.pauseCount || 0), 0),
    averageEfficiency: metrics.length > 0 ? 
      metrics.reduce((total, metric) => 
        total + calculateEfficiencyPercentage(metric.expectedTime, metric.netEffectiveTime), 0) / metrics.length : 0,
    favoriteQuotes,
    notes: notes ? formatNotesSummary(notes) : undefined,
  };
};
