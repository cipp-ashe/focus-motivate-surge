
/**
 * Habit types definition
 * Central source of truth for all habit-related types
 */

// Day of week type
export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SHORT_DAYS: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Default active days
export const DEFAULT_ACTIVE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Metric type definition
export type MetricType = 'timer' | 'journal' | 'boolean' | 'counter' | 'rating';

// Time preference and category types
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export type HabitCategory = 'Health' | 'Work' | 'Personal' | 'Learning' | 'Other';

// Habit interface
export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  timePreference: string;
  metrics: {
    type: MetricType;
    goal: number;
    unit?: string;
  };
  completed: boolean;
  streak: number;
  lastCompleted?: string;
}

// Habit completion record
export interface HabitCompletion {
  habitId: string;
  date: string;
  value: boolean | number;
  notes?: string;
}

// Habit detail (used in many components)
export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  category?: string;
  timePreference?: string;
  metrics: {
    type: MetricType;
    goal?: number;
    unit?: string;
  };
  insights?: any[];
  tips?: any[];
  relationships?: {
    templateId?: string;
  };
}

// Habit metrics type
export interface HabitMetrics {
  type: MetricType;
  goal?: number;
  unit?: string;
}

// Habit progress type
export interface HabitProgress {
  value: boolean | number;
  streak: number;
  date?: string;
  completed?: boolean;
}

// Active template definition
export interface ActiveTemplate {
  templateId: string;
  name?: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized?: boolean;
}

// Habit template definition
export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  color?: string;
  defaultDays?: string[];
  defaultHabits: HabitDetail[];
}

// New template for creation
export interface NewTemplate {
  name: string;
  description: string;
  habits: HabitDetail[];
  defaultDays: DayOfWeek[];
  category: string;
}
