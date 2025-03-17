
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
  | 'timer:state-update';

// Define payloads for each timer event type
export interface TimerEventPayloads {
  'timer:start': { taskName?: string; duration?: number };
  'timer:pause': { taskName?: string; timeLeft?: number; metrics?: any };
  'timer:resume': { taskName?: string; timeLeft?: number; metrics?: any };
  'timer:reset': { taskName?: string; duration?: number };
  'timer:complete': { taskName?: string; metrics?: any };
  'timer:tick': { timeLeft: number };
  'timer:task-set': { taskId: string; taskName: string; duration?: number };
  'timer:select-task': { taskId: string };
  'timer:update': { timeLeft?: number; isRunning?: boolean; isPaused?: boolean };
  'timer:state-update': { state: any };
}

// Task events
export type TaskEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'task:reload';

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
  | 'habit:dismissed';

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

// Combine all event types
export type AllEventTypes = 
  | TimerEventType 
  | TaskEventType 
  | HabitEventType 
  | RelationshipEventType 
  | AppEventType 
  | NavigationEventType;
