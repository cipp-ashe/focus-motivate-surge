
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
    target?: number; // Added target field for backward compatibility
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

// Habit detail (used in many components)
export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  category?: string;
  timePreference?: string;
  metrics: {
    type: MetricType;
    goal?: number;
    target?: number; // Added target field for backward compatibility
    unit?: string;
  };
  insights?: any[];
  tips?: any[];
  relationships?: {
    templateId?: string;
  };
}

// Add default active days
export const DEFAULT_ACTIVE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Habit metrics type
export interface HabitMetrics {
  type: MetricType;
  goal?: number;
  target?: number;
  unit?: string;
}

// Habit progress type
export interface HabitProgress {
  value: boolean | number;
  streak: number;
  date?: string;
  completed?: boolean;
}

// Time preference and category types for tests
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export type HabitCategory = 'Health' | 'Work' | 'Personal' | 'Learning' | 'Other';
