
/**
 * Unified Habit Types
 * This file contains unified types that combine functionality from multiple components
 */

import { ActiveTemplate, HabitDetail, MetricType, DayOfWeek, HabitCompletionEvent, TemplateUpdateEvent } from '@/types/habits';

// Re-export essential types needed by other modules
export type { HabitCompletionEvent, TemplateUpdateEvent };

// Additional export for backward compatibility
export interface HabitProgress {
  value: boolean | number;
  streak?: number;
  date?: string;
  completed?: boolean;
}
