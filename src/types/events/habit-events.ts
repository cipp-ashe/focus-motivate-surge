
/**
 * Consolidated Habit Event System
 * 
 * This module defines all habit-related events and their payloads,
 * serving as the source of truth for the habit event system.
 */

// Import the unified metric type
import { MetricType, HabitDetail } from '@/types/habits';

// Comprehensive list of habit event types
export type HabitEventType =
  | 'habit:complete'
  | 'habit:schedule'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-add'
  | 'habit:template-remove'
  | 'habit:template-order-update'
  | 'habit:template-days-update'
  | 'habits:check-pending'
  | 'habit:create-note'
  | 'habit:dismiss'
  | 'habit:dismissed';

// Habit task event definition
export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: MetricType;
}

// Habit note data definition
export interface HabitNoteData {
  habitId: string;
  habitName: string;
  description?: string;
  templateId?: string;
  date?: string;
  metricType?: MetricType;
  content?: string;
}

// Complete habit event payload map
export interface HabitEventPayloadMap {
  'habit:complete': { 
    habitId: string; 
    date: string; 
    value: boolean | number;
    metricType?: MetricType;
    habitName?: string;
    templateId?: string;
  };
  'habit:schedule': HabitTaskEvent;
  'habit:template-update': {
    templateId: string;
    name?: string;
    description?: string;
    habits?: HabitDetail[];
    activeDays?: string[];
    customized?: boolean;
    [key: string]: any;
  };
  'habit:template-delete': { 
    templateId: string; 
    isOriginatingAction?: boolean;
  };
  'habit:template-add': { 
    templateId: string;
    name?: string;
    description?: string;
    habits?: HabitDetail[];
    activeDays?: string[];
    customized?: boolean;
    id?: string;
  };
  'habit:template-remove': {
    templateId: string;
  };
  'habit:template-order-update': Array<{
    templateId: string;
    [key: string]: any;
  }>;
  'habit:template-days-update': {
    templateId: string;
    activeDays: string[];
    [key: string]: any;
  };
  'habits:check-pending': Record<string, any>;
  'habit:create-note': HabitNoteData;
  'habit:dismiss': {
    habitId: string;
    date: string;
  };
  'habit:dismissed': {
    habitId: string;
    taskId: string;
    date: string;
  };
}
