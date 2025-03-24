
/**
 * Core Habit Type System
 * This is the single source of truth for all habit-related types
 */

// ===== Day of Week Definitions =====
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export type DayOfWeekFull = typeof DAYS_OF_WEEK[number];

export const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export type DayOfWeek = typeof SHORT_DAYS[number];

export const DAY_MAPPINGS: Record<DayOfWeekFull, DayOfWeek> = {
  'Sunday': 'Sun',
  'Monday': 'Mon',
  'Tuesday': 'Tue',
  'Wednesday': 'Wed',
  'Thursday': 'Thu',
  'Friday': 'Fri',
  'Saturday': 'Sat'
};

// Default active days
export const DEFAULT_WEEKDAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DEFAULT_WEEKEND: DayOfWeek[] = ['Sat', 'Sun'];
export const DEFAULT_ALL_DAYS: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DEFAULT_ACTIVE_DAYS = DEFAULT_WEEKDAYS;

// ===== Core Type Definitions =====
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export const TIME_PREFERENCES: TimePreference[] = ['Morning', 'Afternoon', 'Evening', 'Anytime'];

export type HabitCategory = 
  | 'Health' 
  | 'Fitness' 
  | 'Work' 
  | 'Personal' 
  | 'Learning' 
  | 'Mental Health' 
  | 'Wellness' 
  | 'Productivity'
  | 'Mindfulness'
  | 'Nutrition'
  | 'Sleep'
  | 'Social'
  | 'Creativity'
  | 'Finance'
  | 'Other';

export const HABIT_CATEGORIES: HabitCategory[] = [
  'Health', 'Fitness', 'Work', 'Personal', 'Learning', 'Mental Health',
  'Wellness', 'Productivity', 'Mindfulness', 'Nutrition', 'Sleep',
  'Social', 'Creativity', 'Finance', 'Other'
];

export type MetricType = 'timer' | 'journal' | 'boolean' | 'counter' | 'slider' | 'rating' | 'number';

export const METRIC_TO_TASK_TYPE: Record<MetricType, string> = {
  'timer': 'timer',
  'journal': 'journal',
  'boolean': 'todo',
  'counter': 'counter',
  'slider': 'rating',
  'rating': 'rating',
  'number': 'counter'
};

// ===== Core Interfaces =====
export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory | string;
  timePreference: TimePreference;
  metrics: HabitMetrics;
  completed?: boolean;
  streak?: number;
  lastCompleted?: string;
  order?: number;
}

export interface HabitMetrics {
  type: MetricType;
  goal?: number;
  unit?: string;
  min?: number;
  max?: number;
  target?: number;
}

export interface HabitDetail extends Habit {
  metrics: {
    type: MetricType;
    goal?: number;
    target?: number;
    unit?: string;
    min?: number;
    max?: number;
  };
  insights?: string[];
  tips?: string[];
  relationships?: {
    templateId?: string;
  };
  order?: number;
}

// ===== Template Types =====
export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: HabitCategory | string;
  icon?: string;
  color?: string;
  defaultDays?: DayOfWeek[];
  defaultHabits: HabitDetail[];
  duration?: number | null;
}

export interface ActiveTemplate {
  templateId: string;
  name: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized?: boolean;
  relationships?: Record<string, any>;
}

// ===== Event Types =====
export interface HabitCompletionEvent {
  habitId: string;
  date: string;
  value: boolean | number;
  metricType?: MetricType;
  habitName?: string;
  templateId?: string;
}

export interface TemplateUpdateEvent {
  templateId: string;
  name?: string;
  description?: string;
  habits?: HabitDetail[];
  activeDays?: DayOfWeek[];
  customized?: boolean;
  suppressToast?: boolean;
}

export interface TemplateEventHandlers {
  addTemplate: (template: Partial<ActiveTemplate> & { templateId: string }) => void;
  updateTemplate: (template: TemplateUpdateEvent) => void;
  deleteTemplate: (data: { templateId: string; isOriginatingAction?: boolean; }) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (data: { templateId: string; activeDays: string[] }) => void;
}

// ===== Progress Types =====
export interface HabitProgress {
  value: boolean | number;
  streak?: number;
  date?: string;
  completed?: boolean;
}

// ===== Storage Constants =====
export const STORAGE_KEY = 'habits';
export const ACTIVE_TEMPLATES_KEY = 'active-templates';
export const CUSTOM_TEMPLATES_KEY = 'custom-templates';
export const HABIT_PROGRESS_KEY = 'habit-progress';
