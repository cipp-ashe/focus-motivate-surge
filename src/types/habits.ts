
export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export type MetricType = 'timer' | 'journal' | 'boolean' | string;

export interface HabitMetrics {
  type: MetricType;
  target?: number;
  unit?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'Wellness' | 'Work' | 'Personal' | 'Learning';
  timePreference: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  completed: boolean;
  streak: number;
  lastCompleted: Date | null;
  metrics?: HabitMetrics;
  relationships?: {
    templateId?: string;
    [key: string]: any;
  };
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number | boolean;
  timestamp: string;
}

export interface HabitStats {
  streak: number;
  completionRate: number;
  totalDays: number;
  completedDays: number;
}

export const STORAGE_KEY = 'habits';
