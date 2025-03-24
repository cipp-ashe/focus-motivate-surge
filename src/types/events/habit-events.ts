
/**
 * Habit event types and payload definitions
 */
import { MetricType } from '@/types/habits/types';
import { HabitCompletionEvent, TemplateUpdateEvent } from '@/types/habits/unified';

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
  | 'habit:journal-create'
  | 'journal:open';

export interface HabitEventPayloadMap {
  'habit:complete': HabitCompletionEvent;
  'habit:dismiss': {
    habitId: string;
    date: string;
  };
  'habit:template-update': TemplateUpdateEvent;
  'habit:template-delete': {
    templateId: string;
    isOriginatingAction?: boolean;
  };
  'habit:template-add': {
    templateId: string;
    name?: string;
    description?: string;
    habits?: any[];
    activeDays?: string[];
    customized?: boolean;
    suppressToast?: boolean;
  };
  'habit:template-days-update': {
    templateId: string;
    activeDays: string[];
  };
  'habit:template-order-update': any[];
  'habit:schedule': HabitTaskEvent;
  'habits:check-pending': any;
  'habit:custom-template-create': { name: string; description?: string; };
  'habit:custom-template-delete': { templateId: string; suppressToast?: boolean; };
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
  'journal:open': {
    habitId: string;
    habitName: string;
    description?: string;
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
