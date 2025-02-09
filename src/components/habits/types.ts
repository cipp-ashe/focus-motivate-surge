// Day types
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

// Dialog types
export interface DialogState {
  type: 'template' | 'customize' | 'manage';
  open: boolean;
}

// Habit types
export interface HabitMetrics {
  type: 'boolean' | 'duration' | 'count' | 'rating';
  unit?: string;
  min?: number;
  max?: number;
  target?: number;
}

export type InsightType = 'streak' | 'completion' | 'timing' | 'pattern';

export interface HabitInsight {
  type: InsightType;
  description: string;
}

export interface HabitDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  timePreference: string;
  metrics: HabitMetrics;
  insights: HabitInsight[];
  tips: string[];
}

// Template types
export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultHabits: HabitDetail[];
  defaultDays?: DayOfWeek[];
}

export interface ActiveTemplate {
  templateId: string;
  habits: HabitDetail[];
  customized: boolean;
  activeDays: DayOfWeek[];
}

export interface NewTemplate {
  name: string;
  description: string;
  category: string;
  defaultHabits: HabitDetail[];
  defaultDays?: DayOfWeek[];
}

// Progress tracking types
export interface HabitProgress {
  habitId: string;
  templateId: string;
  date: string;
  value: number | boolean;
  notes?: string;
}

export interface DailyProgress {
  [date: string]: {
    value: boolean | number;
    timestamp: number;
  };
}

export interface TemplateProgress {
  [templateId: string]: {
    [habitId: string]: DailyProgress;
  };
}
