
/**
 * Habit Types
 */

// Time of day preference for habits
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';

// Habit frequency
export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

// Days of the week
export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

// Default active days
export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Habit category
export type HabitCategory = 
  | 'Health' 
  | 'Fitness' 
  | 'Nutrition' 
  | 'Mental' 
  | 'Learning' 
  | 'Career' 
  | 'Personal' 
  | 'Social' 
  | 'Creative' 
  | 'Financial'
  | 'Other';

// Habit metric types
export type MetricType = 'boolean' | 'counter' | 'timer' | 'journal' | 'rating';

// Habit metrics
export interface HabitMetrics {
  type: MetricType;
  target?: number;
  unit?: string;
  options?: string[];
}

// Habit streak
export interface Streak {
  current: number;
  longest: number;
  history: Array<{
    start: string;
    end: string;
    length: number;
  }>;
}

// Habit history entry
export interface HabitHistoryEntry {
  date: string;
  completed: boolean;
  value?: number | string;
  notes?: string;
  skipped?: boolean;
  dismissed?: boolean;
}

// Habit detail
export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  timePreference: TimePreference;
  metrics: HabitMetrics;
  insights?: string[];
  tips?: string[];
  order?: number;
  relationships?: {
    taskId?: string;
    noteId?: string;
  };
}

// Habit template
export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  habits: HabitDetail[];
  presetType?: 'system' | 'custom';
  thumbnail?: string;
  order?: number;
  category?: string;
  defaultHabits?: HabitDetail[];
  defaultDays?: DayOfWeek[];
}

// Active template
export interface ActiveTemplate {
  templateId: string;
  name: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  createdAt?: string;
  updatedAt?: string;
  customized?: boolean;
}

// Habit completion event
export interface HabitCompletionEvent {
  habitId: string;
  date: string;
  value?: any;
  metricType?: string;
}

// Template update event
export interface TemplateUpdateEvent {
  templateId: string;
  isOriginatingAction?: boolean;
}

// Storage keys for habits
export const STORAGE_KEY = 'habit-templates';
export const ACTIVE_TEMPLATES_KEY = 'active-habit-templates';
export const CUSTOM_TEMPLATES_KEY = 'custom-habit-templates';

// Compatibility type for Habit (which is referenced in some files)
export interface Habit extends HabitDetail {
  // Add any additional fields needed for compatibility
}
