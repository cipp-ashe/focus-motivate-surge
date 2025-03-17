
/**
 * Types for events in the event system
 */

// Timer events
export type TimerEventType = 
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:tick'
  | 'timer:task-set'
  | 'timer:select-task'
  | 'timer:update'
  | 'timer:state-update'
  | 'timer:init'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:metrics-update'
  | 'timer:set-task';

// Define payloads for each timer event type
export interface TimerEventPayloads {
  'timer:start': { taskName?: string; duration?: number; currentTime?: number };
  'timer:pause': { taskName?: string; timeLeft?: number; metrics?: any; currentTime?: number };
  'timer:resume': { taskName?: string; timeLeft?: number; metrics?: any; currentTime?: number };
  'timer:reset': { taskName?: string; duration?: number };
  'timer:complete': { taskName?: string; metrics?: any };
  'timer:tick': { timeLeft: number; taskName?: string; remaining?: number };
  'timer:task-set': { taskId: string; taskName: string; duration?: number };
  'timer:select-task': { taskId: string };
  'timer:update': { timeLeft?: number; isRunning?: boolean; isPaused?: boolean };
  'timer:state-update': { state: any };
  'timer:init': { taskName: string; duration: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes?: boolean };
  'timer:metrics-update': { taskName?: string; metrics: any };
  'timer:set-task': { id: string; name: string };
}

// Task events
export type TaskEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'task:reload'
  | 'tasks:force-update';

// Habit events
export type HabitEventType =
  | 'habit:schedule'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-order-update'
  | 'habit:custom-template-delete'
  | 'habits:check-pending'
  | 'habit:complete'
  | 'habit:journal-complete'
  | 'habit:progress-update'
  | 'habit:task-deleted'
  | 'habit:dismissed'
  | 'habit:template-add'
  | 'habit:select'
  | 'habit:journal-deleted';

// Journal events
export type JournalEventType =
  | 'journal:open'
  | 'journal:save'
  | 'journal:update'
  | 'journal:delete';

// Relationship events
export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'tag:link'
  | 'tag:unlink'
  | 'quote:link-task';

// App events
export type AppEventType =
  | 'app:initialized'
  | 'app:initialization-complete';

// Navigation events
export type NavigationEventType =
  | 'nav:route-change'
  | 'page:timer-ready';

// Auth events
export type AuthEventType =
  | 'auth:state-change'
  | 'auth:signed-in'
  | 'auth:signed-out';

// Note events
export type NoteEventType =
  | 'note:create'
  | 'note:update'
  | 'note:deleted'
  | 'note:view'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit';

// Tag events
export type TagEventType =
  | 'tag:select'
  | 'tag:remove'
  | 'tags:force-update'
  | 'tag:create'
  | 'tag:delete';

// Combine all event types
export type AllEventTypes = 
  | TimerEventType 
  | TaskEventType 
  | HabitEventType 
  | RelationshipEventType 
  | AppEventType 
  | NavigationEventType
  | AuthEventType
  | NoteEventType
  | TagEventType
  | JournalEventType;

// Create a union type of all event payloads for use in the EventManager
export type EventPayloads = TimerEventPayloads & {
  [key in Exclude<AllEventTypes, TimerEventType>]: any;
};
