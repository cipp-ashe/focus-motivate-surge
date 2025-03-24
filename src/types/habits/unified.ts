
/**
 * Unified Habit Type System
 * 
 * This module redefines habit types to remove the MetricType dependency and 
 * align better with the task type system.
 */

import { TaskType } from '../tasks';

// Core habit definitions
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const SHORT_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Habit preferences and categories
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export type HabitCategory = 'Wellness' | 'Work' | 'Personal' | 'Learning';
export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

// Define metric types to be used in code migrating from the old system
export type MetricType = 'boolean' | 'timer' | 'counter' | 'journal' | 'rating';

// Habit metrics configuration
export interface HabitMetrics {
  // The task type determines the tracking method and UI
  type: MetricType;
  trackingType?: TaskType;
  
  // Optional configuration based on task type
  target?: number;
  unit?: string;
  scale?: number;
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
  metrics: HabitMetrics;
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
