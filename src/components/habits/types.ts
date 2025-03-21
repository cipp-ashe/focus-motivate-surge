
export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type MetricType = 'timer' | 'counter' | 'boolean' | 'rating' | 'journal' | 'checklist' | 'voicenote' | 'screenshot';

export interface HabitMetric {
  type: MetricType;
  target?: number;
  unit?: string;
  min?: number;
  max?: number;
}

export interface HabitProgress {
  value: boolean | number;
  streak: number;
  date: string;
  completed: boolean;
}

export interface HabitInsight {
  type: 'streak' | 'completion' | 'timing' | 'pattern';
  description: string;
}

export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  metrics: HabitMetric;
  category?: string;
  timePreference?: string;
  insights?: HabitInsight[];
  tips?: string[];
  order?: number;
  relationships?: {
    templateId?: string;
    habitId?: string;
    [key: string]: string | undefined;
  };
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category?: string;
  defaultHabits: HabitDetail[];
  defaultDays?: DayOfWeek[];
  duration?: number | null;
}

export interface ActiveTemplate {
  templateId: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized: boolean;
  name?: string;
  description?: string;
  relationships?: {
    habitId?: string;
  };
}

export interface NewTemplate {
  name: string;
  description: string;
  category: string;
  defaultHabits: HabitDetail[];
  defaultDays: DayOfWeek[];
}

export const createEmptyHabit = (): HabitDetail => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  metrics: {
    type: 'boolean',
    target: 1
  }
});
