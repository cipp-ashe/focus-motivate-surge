
/**
 * Habit-related event types and payloads
 */

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
  | 'habit:dismissed'
  | 'journal:open';

// Habit task event definition
export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: string;
}

// Habit note data definition
export interface HabitNoteData {
  habitId: string;
  habitName: string;
  description?: string;
  templateId?: string;
  date?: string;
}

// Habit event payload definitions
export interface HabitEventPayloadMap {
  'habit:complete': { 
    habitId: string; 
    date: string; 
    value: boolean | number;
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
  'journal:open': HabitNoteData;
}
