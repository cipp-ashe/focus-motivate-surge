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
  goal?: number;
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
<<<<<<< HEAD
    templateId?: string;
    [key: string]: any;
=======
    taskId?: string;
    noteId?: string;
>>>>>>> 8f6e595f3ffae8276aadd62cf9467a167da4c55b
  };
}

// Habit template
export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  color?: string;
  icon?: string;
  habits?: HabitDetail[];
  defaultHabits?: HabitDetail[];
  presetType?: 'system' | 'custom';
  thumbnail?: string;
  order?: number;
<<<<<<< HEAD
  duration?: number | null;
  defaultDays?: DayOfWeek[];
  suppressToast?: boolean;
=======
  category?: string;
  defaultHabits?: HabitDetail[];
  defaultDays?: DayOfWeek[];
>>>>>>> 8f6e595f3ffae8276aadd62cf9467a167da4c55b
}

// Active template
// This is a template that has been activated by a user
// and has specific days assigned to it
export interface ActiveTemplate {
  templateId: string;
  name: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  createdAt?: string;
  updatedAt?: string;
  customized?: boolean;
  color?: string;
  icon?: string;
  suppressToast?: boolean;
  category?: string;
}

// Individual habit type
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: HabitCategory;
  completed: boolean;
  streak: number;
  lastCompleted: Date | null;
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
<<<<<<< HEAD

// Default days constants
export const DEFAULT_WEEKDAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DEFAULT_ALL_DAYS: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DEFAULT_ACTIVE_DAYS = DEFAULT_WEEKDAYS;

// Short day names for UI display
export const SHORT_DAYS: Record<DayOfWeek, string> = {
  Sun: 'Su',
  Mon: 'Mo',
  Tue: 'Tu',
  Wed: 'We',
  Thu: 'Th',
  Fri: 'Fr',
  Sat: 'Sa',
};

// Storage keys
export const ACTIVE_TEMPLATES_KEY = 'habit-templates';
export const CUSTOM_TEMPLATES_KEY = 'custom-templates';

// Habit log entry
export interface HabitLog {
  date: string;
  completed: boolean;
  value?: number | string;
  notes?: string;
}

// Habit completion event type
export interface HabitCompletionEvent {
  habitId: string;
  date: string;
  value?: any;
}

// Template update event type
export interface TemplateUpdateEvent {
  templateId: string;
  updates: Partial<ActiveTemplate>;
=======
export const ACTIVE_TEMPLATES_KEY = 'active-habit-templates';
export const CUSTOM_TEMPLATES_KEY = 'custom-habit-templates';

// Compatibility type for Habit (which is referenced in some files)
export interface Habit extends HabitDetail {
  // Add any additional fields needed for compatibility
>>>>>>> 8f6e595f3ffae8276aadd62cf9467a167da4c55b
}
