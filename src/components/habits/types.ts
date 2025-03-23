
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

export type DayOfWeek = typeof DAYS_OF_WEEK[number] | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

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
}

// Habit metrics
export interface HabitMetrics {
  type: 'boolean' | 'timer' | 'journal' | string;
  target?: number;
  unit?: string;
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
