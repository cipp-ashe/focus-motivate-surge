
// Type definitions for all event types used in the application
// This ensures type safety when emitting and listening for events

export type TaskEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:reload';

export type HabitEventType =
  | 'habit:complete'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habits:check-pending';

export type TimerEventType =
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:task-set';

export type NoteEventType =
  | 'note:create'
  | 'note:update'
  | 'note:deleted'
  | 'note:view'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit'
  | 'note:create-from-voice';

export type VoiceNoteEventType =
  | 'voice-note:created'
  | 'voice-note:deleted'
  | 'voice-note:updated';

export type AuthEventType =
  | 'auth:signed-in'
  | 'auth:signed-out'
  | 'auth:state-change';

export type AppEventType =
  | 'app:initialized'
  | 'app:route-changed';

// Union type of all event types for the event bus
export type AllEventTypes =
  | TaskEventType
  | HabitEventType
  | TimerEventType
  | NoteEventType
  | VoiceNoteEventType
  | AuthEventType
  | AppEventType;
