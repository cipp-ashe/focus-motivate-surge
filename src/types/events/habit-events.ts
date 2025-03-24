
/**
 * Habit event types and payload definitions
 */
import { MetricType } from '@/types/habits/types';

export type HabitEventType =
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-add'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:schedule'
  | 'habits:check-pending'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete'
  | 'habit:note-create'
  | 'habit:journal-create';

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
  };
  'habit:template-update': {
    templateId: string;
    [key: string]: any;
  };
  'habit:template-delete': {
    templateId: string;
    isOriginatingAction?: boolean;
  };
  'habit:template-add': {
    templateId: string;
    [key: string]: any;
  };
  'habit:template-days-update': {
    templateId: string;
    activeDays: string[];
  };
  'habit:template-order-update': any[];
  'habit:schedule': HabitTaskEvent;
  'habits:check-pending': any;
  'habit:custom-template-create': { name: string; description?: string; };
  'habit:custom-template-delete': { templateId: string; };
  'habit:note-create': {
    habitId: string;
    habitName: string;
    content: string;
    templateId?: string;
  };
  'habit:journal-create': {
    habitId: string;
    habitName: string;
    content: string;
    templateId?: string;
    date?: string;
  };
}

export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: MetricType;
}
