
// Base event type
export type EventType = string;

// Auth events
export type AuthEventType = 
  | 'auth:state-change'
  | 'auth:sign-in'
  | 'auth:sign-out';

// Timer events
export type TimerEventType = 
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:stop'
  | 'timer:complete'
  | 'timer:add-time'
  | 'timer:reset'
  | 'timer:update';

// Task events
export type TaskEventType = 
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'tasks:reload';

// Note events
export type NoteEventType = 
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select';

// Habit events
export type HabitEventType = 
  | 'habit:complete'
  | 'habit:update'
  | 'habit:delete'
  | 'habit:select'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:progress-update'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-order-update'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete'
  | 'habits:check-pending';

// Voice note events
export type VoiceNoteEventType =
  | 'voicenote:create'
  | 'voicenote:update'
  | 'voicenote:delete'
  | 'voicenote:select';

// All event types combined
export type AllEventTypes = 
  | AuthEventType 
  | TimerEventType 
  | TaskEventType 
  | NoteEventType 
  | HabitEventType
  | VoiceNoteEventType;

// Generic event payload type
export interface EventPayload {
  [key: string]: any;
}
