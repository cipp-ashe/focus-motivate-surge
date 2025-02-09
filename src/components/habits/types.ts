
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type HabitMetricType = 'boolean' | 'duration' | 'count' | 'rating';

export interface HabitMetrics {
  type: HabitMetricType;
  unit?: string;
  min?: number;
  max?: number;
  target?: number;
}

export interface HabitDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  timePreference: string;
  metrics: HabitMetrics;
  insights: Array<{
    type: string;
    description: string;
  }>;
  tips: string[];
}
