
/**
 * Unified Habit Type System
 * Single source of truth for all habit and template related types
 */

// ===== Day of Week Definitions =====

// Full day names for display
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export type DayOfWeekFull = typeof DAYS_OF_WEEK[number];

// Short day names for compact display and storage
export const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export type DayOfWeek = typeof SHORT_DAYS[number];

// Mapping between full and short day names
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

// ===== Time and Category Definitions =====

// Time preferences for habits
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export const TIME_PREFERENCES: TimePreference[] = ['Morning', 'Afternoon', 'Evening', 'Anytime'];

// Categories for habits and templates
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
  'Health',
  'Fitness',
  'Work',
  'Personal',
  'Learning',
  'Mental Health',
  'Wellness',
  'Productivity',
  'Mindfulness',
  'Nutrition',
  'Sleep',
  'Social',
  'Creativity',
  'Finance',
  'Other'
];

// ===== Metric Types and Definitions =====

// All possible metric types for habits
export type MetricType = 'timer' | 'journal' | 'boolean' | 'counter' | 'slider' | 'rating' | 'number';

// Mapping between metric types and task types for integration
export const METRIC_TO_TASK_TYPE: Record<MetricType, string> = {
  'timer': 'timer',
  'journal': 'journal',
  'boolean': 'todo',
  'counter': 'counter',
  'slider': 'rating',
  'rating': 'rating',
  'number': 'counter'
};

// ===== Core Habit Types =====

// Base habit interface
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

// Detailed habit with additional properties
export interface HabitDetail extends Habit {
  description: string;
  category: HabitCategory | string;
  timePreference: TimePreference;
  metrics: {
    type: MetricType;
    goal?: number;
    target?: number;
    unit?: string;
    min?: number;
    max?: number;
  };
  insights?: any[];
  tips?: string[];
  relationships?: {
    templateId?: string;
  };
  order?: number;
}

// Habit metrics configuration
export interface HabitMetrics {
  type: MetricType;
  goal?: number;
  unit?: string;
  min?: number;
  max?: number;
  target?: number;
}

// Habit completion record
export interface HabitCompletion {
  habitId: string;
  date: string;
  value: boolean | number;
  notes?: string;
}

// Progress tracking for a habit
export interface HabitProgress {
  value: boolean | number;
  streak?: number;
  date?: string;
  completed?: boolean;
}

// Habit logs for tracking completion history
export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  value?: boolean | number;
}

// ===== Template Types =====

// Definition of a habit template (blueprint for creating habits)
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

// Active template instance that a user has added to their routine
export interface ActiveTemplate {
  templateId: string;
  name: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized?: boolean;
  relationships?: Record<string, any>;
}

// Template for creating a new custom template
export interface NewTemplate {
  name: string;
  description: string;
  habits: HabitDetail[];
  defaultDays: DayOfWeek[];
  category: string;
}

// Event for habit completion
export interface HabitCompletionEvent {
  habitId: string;
  date: string;
  value: boolean | number;
  metricType?: MetricType;
  habitName?: string;
  templateId?: string;
}

// Event for template updates
export interface TemplateUpdateEvent {
  templateId: string;
  name?: string;
  description?: string;
  habits?: HabitDetail[];
  activeDays?: DayOfWeek[];
  customized?: boolean;
  suppressToast?: boolean;
}

// ===== Storage Constants =====
export const STORAGE_KEY = 'habits';
export const ACTIVE_TEMPLATES_KEY = 'active-templates';
export const CUSTOM_TEMPLATES_KEY = 'custom-templates';
export const HABIT_PROGRESS_KEY = 'habit-progress';
