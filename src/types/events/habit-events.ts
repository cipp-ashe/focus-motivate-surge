
/**
 * Habit-related event types and payloads
 */

// Import metric type
import { MetricType } from '@/components/habits/types';

// Habit event type definitions
export type HabitEventType =
  | 'habit:complete'
  | 'habit:schedule'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-add'
  | 'habit:template-order-update'
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

// Habit event payload definitions
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
  'habit:template-update': any;
  'habit:template-delete': { 
    templateId: string; 
    isOriginatingAction?: boolean;
  };
  'habit:template-add': { 
    templateId: string;
    id?: string;
  };
  'habit:template-order-update': any[];
  'habits:check-pending': any;
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
