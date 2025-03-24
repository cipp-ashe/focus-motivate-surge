
/**
 * Unified Event Types
 * 
 * This file centralizes all event type definitions to ensure consistency
 * across the application and avoid TypeScript errors.
 */

// Import base types
import { Task, TaskType } from '@/types/tasks';
import { HabitEventType, HabitEventPayloadMap } from './habit-events';
import { MetricType } from '@/types/habits/types';
import { TimerEventType, TimerEventPayloadMap } from './timer-events';

// Define the core event types
export type CoreEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'task:timer'
  | 'task:reload'
  | 'task:show-image'
  | 'task:open-checklist'
  | 'task:open-journal'
  | 'task:open-voice-recorder'
  | 'habit:tasks-sync'
  | 'habits:check-pending'
  | 'tag:link'
  | 'tag:unlink'
  | 'timer:tick'
  | 'timer:init'
  | 'timer:close'
  | 'timer:start'
  | 'app:initialized'
  | 'journal:open'
  | 'journal:update'
  | 'journal:delete'
  | 'note:add'
  | 'voice-note:add'
  | 'voice-note:create'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'quote:link-task'
  | 'habit:template-delete'
  | 'habit:template-remove'
  | 'habit:dismissed'
  | 'habit:select'
  | 'habit:schedule';

// Define the unified event type that includes both core, habit and timer events
export type EventType = CoreEventType | HabitEventType | TimerEventType | string;

// Define payload types for core events
export interface CoreEventPayloadMap {
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string | null;
  'task:dismiss': { taskId: string; habitId?: string; date?: string };
  'task:timer': { taskId: string; minutes: number; notes?: string };
  'task:reload': undefined;
  'task:show-image': { imageUrl: string; taskName: string };
  'task:open-checklist': { taskId: string; taskName: string; items: any[] };
  'task:open-journal': { taskId: string; taskName: string; entry: string };
  'task:open-voice-recorder': { taskId: string; taskName: string };
  'habit:tasks-sync': { templateId: string; habits: any[] };
  'habits:check-pending': any;
  'tag:link': { tagId: string; entityId: string; entityType: string };
  'tag:unlink': { tagId: string; entityId: string; entityType: string };
  'timer:tick': { timeLeft: number; taskId?: string; taskName?: string };
  'timer:init': { duration?: number; taskId?: string; taskName?: string };
  'timer:close': undefined;
  'timer:start': { taskId?: string; taskName?: string; duration?: number };
  'app:initialized': { userId?: string };
  'journal:open': { habitId: string; habitName: string; description?: string; templateId?: string; date?: string };
  'journal:update': { id: string; content: string; title?: string };
  'journal:delete': { id: string };
  'note:add': { title: string; content: string; tags?: string[]; createdAt?: string };
  'voice-note:add': { id: string; title: string; audioUrl: string; duration: number; transcript?: string };
  'voice-note:create': { title: string; audioUrl: string; duration: number; transcript?: string };
  'relationship:update': { entityId: string; relatedId: string; type: string };
  'relationship:batch-update': { entityId: string; relatedIds: string[]; type: string };
  'quote:link-task': { quoteId: string; taskId: string };
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-remove': { templateId: string };
  'habit:dismissed': { habitId: string; date: string };
  'habit:select': { habitId: string };
  'habit:schedule': HabitTaskEvent;
}

// Combine core, habit and timer event payload maps
export interface EventPayloadMap extends CoreEventPayloadMap, HabitEventPayloadMap, TimerEventPayloadMap {}

// Define EventPayload type for type safety in event callbacks
export type EventPayload<T extends EventType> = T extends keyof EventPayloadMap ? EventPayloadMap[T] : any;

// Define EventCallback type for consistency in event handlers
export type EventCallback<T extends EventType> = (payload: EventPayload<T> & { timestamp?: string }) => void;

// HabitTaskEvent type for habit-task integration
export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: MetricType;
}
