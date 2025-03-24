
/**
 * Unified habit types
 */

import { MetricType } from './types';

// Habit interface
export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  timePreference: string;
  metrics: {
    type: MetricType;
    goal?: number;
    unit?: string;
  };
  completed: boolean;
  streak: number;
  lastCompleted?: string;
}

// Habit completion record
export interface HabitCompletion {
  habitId: string;
  date: string;
  value: boolean | number;
  notes?: string;
}
