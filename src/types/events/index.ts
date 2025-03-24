
/**
 * Event Types Module
 * 
 * This is the main entry point for all event-related types.
 */

// Import all event type definitions
import { TaskEventType, TaskEventPayloadMap } from './task-events';
import { JournalEventType, JournalEventPayloadMap } from './journal-events';
import { HabitEventType, HabitEventPayloadMap } from './habit-events';

// Define additional custom events
export type CustomEventType = 
  | 'tag:link'
  | 'tag:unlink'
  | 'habit:select'
  | 'habit:dismissed'
  | 'habit:tasks-sync'
  | 'habit:check-pending'
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'voice-note:create'
  | 'task:add'
  | 'timer:set-task'
  | 'quote:link-task'
  | 'relationship:batch-update'
  | 'habit:template-remove'
  | 'journal:open'
  | 'journal:close'
  | 'journal:get'
  | 'journal:list'
  | 'journal:save'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete';

// Union of all event types
export type EventType = 
  | TaskEventType 
  | JournalEventType 
  | HabitEventType 
  | CustomEventType;

// Union of all event payload maps
export interface EventPayloadMap extends 
  TaskEventPayloadMap,
  JournalEventPayloadMap,
  HabitEventPayloadMap {
  'tag:link': { taskId: string; tag: string };
  'tag:unlink': { taskId: string; tag: string };
  'habit:select': string;
  'habit:dismissed': { habitId: string; date: string };
  'habit:tasks-sync': undefined;
  'habit:check-pending': any;
  'journal:create': { id: string; content: string; date: string; habitId?: string };
  'journal:update': { id: string; content: string };
  'journal:delete': { id: string };
  'voice-note:create': { id: string; text: string; audioUrl: string; transcript?: string };
  'task:add': { id: string; name: string };
  'timer:set-task': { id: string; name: string; duration: number; taskId?: string; completed?: boolean; createdAt?: string; taskType?: string };
  'quote:link-task': { quoteId: string; taskId: string };
  'relationship:batch-update': any;
  'habit:template-remove': { templateId: string };
  'journal:open': { habitId: string; habitName: string; date: string; templateId?: string };
  'journal:close': { habitId: string; saved: boolean };
  'journal:get': { habitId: string; date?: string };
  'journal:list': { habitId?: string };
  'journal:save': { habitId: string; content: string; date?: string };
}

// Callback type for event handlers
export type EventCallback<T extends EventType> = (payload: EventPayloadMap[T]) => void;

// Event handling interface extensions
export interface EventUnsubscribe {
  (): void;
}

export interface EventPayload<T extends EventType> {
  [key: string]: any;
}

// Export all event-specific types
export * from './task-events';
export * from './journal-events';
export * from './habit-events';
