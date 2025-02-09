
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultHabits: HabitDetail[];
  defaultDays: DayOfWeek[];
}

export interface NewTemplate {
  name: string;
  description: string;
  category: string;
  defaultHabits: HabitDetail[];
  defaultDays: DayOfWeek[];
}

export interface HabitDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  timePreference: string;
  metrics: HabitMetrics;
  insights: HabitInsight[];
  tips: string[];
}

export interface HabitMetrics {
  type: 'boolean' | 'duration' | 'count' | 'rating';
  unit?: string;
  min?: number;
  max?: number;
  target?: number;
}

export interface HabitInsight {
  type: string;
  description: string;
}

export interface ActiveTemplate {
  templateId: string;
  habits: HabitDetail[];
  customized: boolean;
  activeDays: DayOfWeek[];
}

export interface TemplateProgress {
  [key: string]: {
    [habitId: string]: any;
  };
}

export interface DialogState {
  type: 'customize' | 'manage';
  open: boolean;
}
