import type { TimerMetrics } from "@/types/metrics";

export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  metrics?: {
    type: 'timer' | 'counter';
    target?: number;
    unit?: string;
  };
  order?: number;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  defaultHabits: HabitDetail[];
  defaultDays?: DayOfWeek[];
}

export interface ActiveTemplate {
  templateId: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized: boolean;
  relationships?: {
    habitId?: string;
  };
}
