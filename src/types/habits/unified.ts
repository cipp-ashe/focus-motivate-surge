
/**
 * Unified Habit Type Definitions
 * 
 * This file re-exports the core types with additional context-specific types
 * for easier importing throughout the application.
 */

import { 
  DayOfWeek, 
  HabitTemplate, 
  HabitDetail, 
  MetricType,
  ActiveTemplate
} from './types';

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

// Re-export common types for direct import
export type {
  DayOfWeek,
  HabitTemplate,
  HabitDetail,
  MetricType,
  ActiveTemplate
};
