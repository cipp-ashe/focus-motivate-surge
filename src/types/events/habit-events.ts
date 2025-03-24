
/**
 * Habit Event Types
 * 
 * Centralizes all habit-related event types and payloads
 */
import { ActiveTemplate, DayOfWeek, HabitDetail, MetricType } from '../habits/types';

// Define all habit-related event types
export type HabitEventType =
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:custom-template-add'
  | 'habit:custom-template-delete';

// Define payload types for each event
export interface HabitEventPayloadMap {
  'habit:complete': {
    habitId: string;
    date: string;
    value: boolean | number;
    metricType?: MetricType;
    habitName?: string;
    templateId?: string;
  };
  'habit:dismiss': {
    habitId: string;
    date: string;
    templateId?: string;
  };
  'habit:template-add': Partial<ActiveTemplate> & { templateId: string };
  'habit:template-update': {
    templateId: string;
    name?: string;
    description?: string;
    habits?: HabitDetail[];
    activeDays?: DayOfWeek[];
    customized?: boolean;
    suppressToast?: boolean;
  };
  'habit:template-delete': {
    templateId: string;
    isOriginatingAction?: boolean;
  };
  'habit:template-days-update': {
    templateId: string;
    activeDays: DayOfWeek[];
  };
  'habit:template-order-update': ActiveTemplate[];
  'habit:custom-template-add': {
    id: string;
    name: string;
    description: string;
    category: string;
    defaultHabits: HabitDetail[];
    defaultDays: DayOfWeek[];
  };
  'habit:custom-template-delete': {
    templateId: string;
    suppressToast?: boolean;
  };
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
