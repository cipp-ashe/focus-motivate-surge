
// Import and re-export all event types for convenience
import type { 
  Task, 
  TaskStatus, 
  TaskType,
  TaskMetrics
} from './tasks';

import type { 
  TimerStateMetrics,
  TimerMetrics 
} from './metrics';

// Timer related events
export type TimerEventType = 
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:tick'
  | 'timer:init'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:state-update'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:close'
  | 'timer:metrics-update';  // Added missing event

// Task related events
export type TaskEventType = 
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:dismiss'
  | 'task:reload'
  | 'task:select';  // Added missing event

// Habit related events
export type HabitEventType = 
  | 'habit:complete'
  | 'habit:skip'
  | 'habit:add'
  | 'habit:update'
  | 'habit:delete'
  | 'habit:schedule'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:custom-template-delete'
  | 'habits:check-pending'
  | 'habit:select'  // Added missing event
  | 'habit:dismissed'  // Added missing event
  | 'habit:task-deleted'  // Added missing event
  | 'habit:journal-deleted';  // Added missing event

// Relationship related events
export type RelationshipEventType = 
  | 'relationship:create'
  | 'relationship:update'
  | 'relationship:delete'
  | 'relationship:batch-update';

// App related events
export type AppEventType = 
  | 'app:initialized'
  | 'app:initialization-complete'
  | 'app:startup-tasks';

// Navigation events
export type NavigationEventType = 
  | 'nav:route-change'
  | 'page:timer-ready';

// Auth events
export type AuthEventType = 
  | 'auth:signed-in'
  | 'auth:signed-out'
  | 'auth:state-change';  // Added missing event

// Note events
export type NoteEventType = 
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:create-from-habit'
  | 'note:create-from-voice'
  | 'journal:open'
  | 'note:view'  // Added missing event
  | 'note:deleted'  // Added missing event
  | 'note:format'  // Added missing event
  | 'note:format-complete';  // Added missing event

// Tag events
export type TagEventType = 
  | 'tag:create'
  | 'tag:delete'
  | 'tag:update'
  | 'tag:link'
  | 'tag:unlink'
  | 'tags:force-update';

// Quote events
export type QuoteEventType = 
  | 'quote:link-task';  // Added missing event

// Union of all event types
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
  | QuoteEventType;  // Added missing category

// Event payload types mapped to event names
export interface EventPayloads {
  // Timer events
  'timer:start': { taskName: string; duration: number; currentTime?: number };
  'timer:pause': { taskName: string; timeLeft: number; metrics?: TimerStateMetrics };
  'timer:resume': { taskName: string; timeLeft: number; currentTime?: number; metrics?: TimerStateMetrics };
  'timer:reset': { taskName: string; duration?: number };
  'timer:complete': { taskName: string; metrics: TimerStateMetrics };
  'timer:tick': { taskName: string; timeLeft: number; remaining?: number };
  'timer:init': { taskName: string; duration: number };
  'timer:set-task': Task | { id: string; name: string };
  'timer:task-set': { taskId: string; taskName: string; duration?: number };
  'timer:state-update': { isRunning: boolean; secondsRemaining: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes?: boolean };
  'timer:close': { taskName: string };
  'timer:metrics-update': { taskName: string; metrics: Partial<TimerStateMetrics> };
  
  // Task events
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: string; suppressToast?: boolean };
  'task:complete': { taskId: string; metrics?: TaskMetrics };
  'task:dismiss': { taskId: string; habitId: string; date: string };
  'task:reload': Record<string, never>;
  'task:select': string;
  
  // Habit events
  'habit:complete': { habitId: string; date: string };
  'habit:skip': { habitId: string; date: string };
  'habit:add': { name: string; description?: string };
  'habit:update': { habitId: string; updates: any };
  'habit:delete': { habitId: string };
  'habit:schedule': { habitId: string; templateId: string; name: string; duration: number; date: string; metricType?: string };
  'habit:template-add': string | { id: string; [key: string]: any };
  'habit:template-update': { templateId: string; [key: string]: any };
  'habit:template-delete': { templateId: string; suppressToast?: boolean; isOriginatingAction?: boolean };
  'habit:custom-template-delete': { templateId: string };
  'habits:check-pending': Record<string, never>;
  'habit:select': string;
  'habit:dismissed': { habitId: string; date: string };
  'habit:task-deleted': { habitId: string; date: string };
  'habit:journal-deleted': { habitId: string; date: string };
  
  // Relationship events
  'relationship:create': { sourceId: string; sourceType: string; targetId: string; targetType: string; relationType: string };
  'relationship:update': { sourceId: string; targetId: string; updates: any };
  'relationship:delete': { sourceId: string; targetId: string };
  'relationship:batch-update': { updates: Array<{ sourceId: string; targetId: string; updates: any }> };
  
  // App events
  'app:initialized': { timestamp: string };
  'app:initialization-complete': { timestamp: string };
  'app:startup-tasks': { timestamp: string };
  
  // Navigation events
  'nav:route-change': { path: string; previous?: string };
  'page:timer-ready': { timestamp: string };
  
  // Auth events
  'auth:signed-in': { userId: string; user?: any };
  'auth:signed-out': Record<string, never>;
  'auth:state-change': { user: any };
  
  // Note events
  'note:create': { id: string; title: string; content: string };
  'note:update': { id: string; updates: any };
  'note:delete': { id: string };
  'note:create-from-habit': { habitId: string; habitName: string; description?: string; templateId?: string; content?: string };
  'note:create-from-voice': { audioUrl: string; transcript?: string };
  'journal:open': { habitId: string; habitName: string; description?: string; templateId?: string };
  'note:view': { noteId: string };
  'note:deleted': { noteId: string };
  'note:format': { noteId: string; action: string };
  'note:format-complete': { noteId: string };
  
  // Tag events
  'tag:create': { name: string; color?: string };
  'tag:delete': { id: string };
  'tag:update': { id: string; updates: any };
  'tag:link': { tagId: string; entityId: string; entityType: string };
  'tag:unlink': { tagId: string; entityId: string };
  'tags:force-update': { timestamp: string };
  
  // Quote events
  'quote:link-task': { quoteId: string; taskId: string };
  
  // Add any other event types and their payloads here
  [key: string]: any;
}

// Export types for core entities
export type EntityType = 'task' | 'habit' | 'note' | 'tag' | 'template' | 'quote' | 'relationship';

