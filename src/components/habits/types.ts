
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun' | 
                        'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Constants for days of week
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const SHORT_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type MetricType = 'timer' | 'journal' | 'boolean' | 'counter' | 'rating';

export interface HabitMetrics {
  type: MetricType;
  target?: number;
  unit?: string;
}

export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  category?: 'Wellness' | 'Work' | 'Personal' | 'Learning';
  timePreference?: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  metrics: HabitMetrics;
  insights?: string[];
  tips?: string[];
  relationships?: {
    templateId?: string;
    [key: string]: any;
  };
}

export interface ActiveTemplate {
  templateId: string;
  name: string;
  description?: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized: boolean;
  suppressToast?: boolean;
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
}
