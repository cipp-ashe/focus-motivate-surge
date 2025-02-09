import { TimerMetrics } from "./metrics";
import { Quote } from "./timer";
import { Note } from "@/types/notes";

export interface FormattedMetrics {
  plannedDuration: string;
  actualDuration: string;
  netEffectiveTime: string;
  efficiency: number;
  pauseCount: number;
  favoriteQuotes: Quote[];
}

export interface TaskSummary {
  taskName: string;
  metrics?: TimerMetrics;
  formattedMetrics?: FormattedMetrics | null;
  relatedQuotes?: Quote[];
}

export interface NotesSummary {
  notes: Note[];
  tags: string[];
  totalNotes: number;
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
  notes?: NotesSummary;
}
