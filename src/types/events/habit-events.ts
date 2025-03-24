
/**
 * Habit-related event types and payloads
 */

// Habit event type definitions
export type HabitEventType =
  | 'habit:schedule'
  | 'habit:complete'
  | 'habit:select'
  | 'habit:template-delete'
  | 'habit:template-update'
  | 'habit:check-pending'
  | 'habit:dismissed'
  | 'habits:check-pending'
  | 'habits:verify-tasks'
  | 'habits:tasks-sync'
  | 'habit:template-add'
  | 'habit:template-remove'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:dismiss'
  | 'habit:tasks-sync'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete';

// Type for HabitTaskEvent (needed for habit scheduling)
export interface HabitTaskEvent {
  habitId: string;
  name: string;
  duration: number;
  templateId: string;
  date: string;
  metricType?: string;
}

// Type for habit note data when creating notes from habits
export interface HabitNoteData {
  habitId: string;
  habitName: string;
  content: string;
  templateId?: string;
}

// Habit event payload definitions
export interface HabitEventPayloadMap {
  'habit:schedule': HabitTaskEvent;
  'habit:complete': { habitId: string; date: string; value: any };
  'habit:select': { habitId: string };
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-update': any;
  'habit:check-pending': Record<string, any>;
  'habit:dismissed': { habitId: string; taskId: string; date: string };
  'habits:check-pending': Record<string, any>;
  'habits:verify-tasks': Record<string, any>;
  'habits:tasks-sync': Record<string, any>;
  'habit:template-add': any;
  'habit:template-remove': { templateId: string };
  'habit:template-days-update': { templateId: string; days: any[] };
  'habit:template-order-update': any[];
  'habit:dismiss': { habitId: string; date: string };
  'habit:tasks-sync': any;
  'habit:custom-template-create': any;
  'habit:custom-template-delete': { templateId: string };
}
