
/**
 * Unified Habit Type Definitions
 * 
 * This file centralizes all habit-related types to ensure consistency
 * across the application.
 */

import { 
  DayOfWeek, 
  HabitTemplate, 
  HabitDetail, 
  MetricType,
  ActiveTemplate
} from './types';

// Habit metrics definition with consistent goal property
export interface HabitMetrics {
  type: MetricType;
  goal?: number;
  unit?: string;
  min?: number;
  max?: number;
}

// Standardized habit progress interface
export interface HabitProgress {
  value: boolean | number;
  streak: number;
  date?: string;
  completed?: boolean;
}

// Standardized template creation interface
export interface CreateTemplateRequest {
  name: string;
  description: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  category?: string;
}

// Standardized habit completion event
export interface HabitCompletionEvent {
  habitId: string;
  date: string;
  value: boolean | number;
  metricType?: MetricType;
  habitName?: string;
  templateId?: string;
}

// Standardized template update event
export interface TemplateUpdateEvent {
  templateId: string;
  name?: string;
  description?: string;
  habits?: HabitDetail[];
  activeDays?: DayOfWeek[];
  customized?: boolean;
  suppressToast?: boolean;
}

// Standardized template event handlers
export interface TemplateEventHandlers {
  addTemplate: (template: Partial<ActiveTemplate> & { templateId: string }) => void;
  updateTemplate: (template: TemplateUpdateEvent) => void;
  deleteTemplate: (data: { templateId: string; isOriginatingAction?: boolean; }) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (data: { templateId: string; activeDays: string[] }) => void;
}

// Expose common types for direct import
export type {
  DayOfWeek,
  HabitTemplate,
  HabitDetail,
  MetricType,
  ActiveTemplate
};
