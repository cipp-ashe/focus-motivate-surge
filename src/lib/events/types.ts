
// Base event type
export type EventType = string;

// Auth events
export type AuthEventType = 
  | 'auth:state-change'
  | 'auth:sign-in'
  | 'auth:sign-out'
  | 'auth:signed-out'
  | 'auth:logout'
  | 'auth:login';

// Timer events
export type TimerEventType = 
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:stop'
  | 'timer:complete'
  | 'timer:add-time'
  | 'timer:reset'
  | 'timer:update'
  | 'timer:tick'
  | 'timer:init'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:close'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:metrics-update'
  | 'timer:update-metrics';

// Task events
export type TaskEventType = 
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'tasks:reload'
  | 'task:reload';

// Note events
export type NoteEventType = 
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:view'
  | 'note:deleted'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit'
  | 'note:create-from-voice';

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
  | 'habits:check-pending'
  | 'habit:schedule'
  | 'habit:dismissed'
  | 'habit:task-deleted'
  | 'habit:template-add'
  | 'journal:open'
  | 'habit:create'
  | 'habits:processed';

// Voice note events
export type VoiceNoteEventType =
  | 'voicenote:create'
  | 'voicenote:update'
  | 'voicenote:delete'
  | 'voicenote:select'
  | 'voice-note:created'
  | 'voice-note:deleted';

// Tag-related events
export type TagEventType =
  | 'tag:link'
  | 'tag:unlink'
  | 'tags:force-update'
  | 'tag:create'
  | 'tag:update'
  | 'tag:delete';

// Relationship events
export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update';

// Miscellaneous events
export type MiscEventType =
  | 'app:initialized'
  | 'quote:link-task'
  | 'app:ready'
  | 'navigation:changed';

// Journal events
export type JournalEventType = 
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:open';

// Quote events
export type QuoteEventType = 
  | 'quote:favorite'
  | 'quote:unfavorite'
  | 'quote:link-task';

// All event types combined
export type AllEventTypes = 
  | AuthEventType 
  | TimerEventType 
  | TaskEventType 
  | NoteEventType 
  | HabitEventType
  | VoiceNoteEventType
  | TagEventType
  | RelationshipEventType
  | MiscEventType
  | JournalEventType
  | QuoteEventType;

// Generic event payload type
export interface EventPayload {
  [key: string]: any;
}

// Type definition for event handlers
export type EventHandler<T = any> = (payload: T) => void;

// Map of event types to their payload types
export interface EventPayloads {
  [key: string]: any;
  'auth:state-change': { user: any | null };
  'auth:login': { user?: any };
  'auth:logout': undefined;
  'habit:schedule': {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
  };
  'timer:update-metrics': { taskId?: string, metrics?: any, taskName?: string };
}
