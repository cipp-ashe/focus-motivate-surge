
// Habit system type definitions - consolidated to prevent circular dependencies

// Days of week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const;

// Shortened day names for compatibility
export const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number] | typeof SHORT_DAYS[number];

// Default active days for new templates
export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Habit templates
export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category?: string;
  defaultHabits: Array<{
    id: string;
    name: string;
    description?: string;
    type?: string;
    metrics?: HabitMetrics;
  }>;
  defaultDays?: DayOfWeek[];
  duration?: number | null; // Added for compatibility
}

export type NewTemplate = Omit<HabitTemplate, 'id'>;

// Active template (instance of a template)
export interface ActiveTemplate {
  templateId: string;
  name?: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized: boolean;
  relationships?: Record<string, any>; // Added for compatibility
}

// Props for tab sections
export interface TabSectionProps {
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
}

// Detailed habit structure
export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  type?: string;
  category?: string;
  timePreference?: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  metrics?: HabitMetrics;
  insights?: Array<{
    type: string;
    description: string;
  }>;
  tips?: string[];
  relationships?: Record<string, any>; // Added for compatibility
  order?: number; // Added for compatibility
}

// Define MetricType for reuse
export type MetricType = 'boolean' | 'timer' | 'journal' | 'counter' | 'rating' | string;

// Habit metrics
export interface HabitMetrics {
  type: MetricType;
  target?: number;
  unit?: string;
  min?: number; // Added for rating type metrics
  max?: number; // Added for rating type metrics
}

// Habit progress tracking
export interface HabitProgress {
  date: string;
  value: boolean | number;
  streak?: number;
  completed?: boolean;
}

// Progress result
export interface HabitProgressResult {
  value: boolean | number;
  streak: number;
  completed: boolean;
}

// Structure for habit event handlers
export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: string;
}

// Helper function to create an empty habit
export const createEmptyHabit = (): HabitDetail => ({
  id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: '',
  description: '',
  metrics: { type: 'boolean' },
  category: 'Personal',
  timePreference: 'Anytime',
  insights: [],
  tips: []
});
