// Types for habit data structures

export interface HabitProgress {
  id?: string;
  habitId?: string;
  value: boolean | number;
  streak: number;
  date: string;
  completed: boolean;
}

export type TimePreference = 'morning' | 'afternoon' | 'evening' | 'any';

export type MetricType = 'boolean' | 'counter' | 'timer' | 'journal' | 'rating';

// Other habit-related types can be added here

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number | boolean;
  timestamp: string;
}

export interface HabitStats {
  streak: number;
  completionRate: number;
  totalDays: number;
  completedDays: number;
}

// Add missing TimePreferenceObject for insights component
export interface TimePreferenceObject {
  type: string; 
  description: string;
}

// For InsightsTips component
export interface InsightsTipsProps {
  habit: {
    name?: string;
    description?: string;
    timePreference?: TimePreference | TimePreferenceObject;
    insights?: Array<string | { type: string, description: string }>;
    tips?: Array<string | { type: string, description: string }>;
  };
}
