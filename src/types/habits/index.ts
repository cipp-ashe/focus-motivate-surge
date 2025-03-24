
/**
 * Unified Habit Types Module
 * 
 * This module serves as the central type system for all habit-related functionality,
 * consolidating various type definitions that were previously scattered across the codebase.
 */

// Core type definitions for habits
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const SHORT_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Habit type definitions
export type MetricType = 'timer' | 'journal' | 'boolean' | 'counter' | 'rating';
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export type HabitCategory = 'Wellness' | 'Work' | 'Personal' | 'Learning';
export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

// Habit metrics interface
export interface HabitMetrics {
  type: MetricType;
  target?: number;
  unit?: string;
}

// Core habit data structure
export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  timePreference: TimePreference;
  completed: boolean;
  streak: number;
  lastCompleted: Date | null;
  metrics?: HabitMetrics;
  relationships?: {
    templateId?: string;
    [key: string]: any;
  };
}

// Detailed habit representation with more optional fields
export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  category?: HabitCategory;
  timePreference?: TimePreference;
  metrics: HabitMetrics;
  insights?: string[];
  tips?: string[];
  relationships?: {
    templateId?: string;
    [key: string]: any;
  };
  order?: number;
}

// Template-related interfaces
export interface ActiveTemplate {
  templateId: string;
  name: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized: boolean;
  suppressToast?: boolean;
  relationships?: {
    [key: string]: any;
  };
}

export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  defaultHabits: HabitDetail[];
  defaultDays?: DayOfWeek[];
  category?: string;
  duration?: number | null;
}

export interface NewTemplate {
  name: string;
  description?: string;
  defaultHabits: HabitDetail[];
  defaultDays?: DayOfWeek[];
  category?: string;
  habits?: HabitDetail[];
  days?: DayOfWeek[];
}

// Progress tracking interfaces
export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number | boolean;
  timestamp: string;
}

export interface HabitProgress {
  date: string;
  value: boolean | number;
  notes?: string;
  completed?: boolean;
  streak?: number;
  id?: string;
  habitId?: string;
}

export interface HabitProgressResult {
  progress: HabitProgress[];
  streak: number;
  completion: number;
}

export interface HabitStats {
  streak: number;
  completionRate: number;
  totalDays: number;
  completedDays: number;
}

// Storage constants
export const STORAGE_KEY = 'habits';
export const TEMPLATES_STORAGE_KEY = 'habit-templates';
export const CUSTOM_TEMPLATES_KEY = 'custom-templates';
