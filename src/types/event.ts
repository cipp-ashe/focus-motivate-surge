
/**
 * Unified Event Types
 * Single source of truth for all event-related types
 */

import { ActiveTemplate, DayOfWeek, HabitDetail, MetricType, HabitCompletionEvent, TemplateUpdateEvent } from './habit';
import { Task } from './task';
import { Note } from './note';

// Re-export the event types for easy consumption
export { HabitCompletionEvent, TemplateUpdateEvent };

// Base event types
export type EventUnsubscribe = () => void;

export interface BaseEventCallback<T = any> {
  (payload: T): void;
}

export interface BaseEventPayload {
  [key: string]: any;
}

export interface EventHandler<T = any> {
  (payload: T): void;
}

export interface EventDispatcher {
  emit<E extends string>(event: E, payload?: any): void;
  on<E extends string>(event: E, handler: EventHandler): EventUnsubscribe;
  off<E extends string>(event: E, handler: EventHandler): void;
  once<E extends string>(event: E, handler: EventHandler): EventUnsubscribe;
}

// Habit event types
export type HabitEventType =
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:custom-template-add'
  | 'habit:custom-template-delete';

export interface HabitEventPayloadMap {
  'habit:complete': {
    habitId: string;
    date: string;
    value: boolean | number;
    metricType?: MetricType;
    habitName?: string;
    templateId?: string;
  };
  'habit:dismiss': {
    habitId: string;
    date: string;
    templateId?: string;
  };
  'habit:template-add': Partial<ActiveTemplate> & { templateId: string };
  'habit:template-update': {
    templateId: string;
    name?: string;
    description?: string;
    habits?: HabitDetail[];
    activeDays?: DayOfWeek[];
    customized?: boolean;
    suppressToast?: boolean;
  };
  'habit:template-delete': {
    templateId: string;
    isOriginatingAction?: boolean;
  };
  'habit:template-days-update': {
    templateId: string;
    activeDays: DayOfWeek[];
  };
  'habit:template-order-update': ActiveTemplate[];
  'habit:custom-template-add': {
    id: string;
    name: string;
    description: string;
    category: string;
    defaultHabits: HabitDetail[];
    defaultDays: DayOfWeek[];
  };
  'habit:custom-template-delete': {
    templateId: string;
    suppressToast?: boolean;
  };
}

// Task event types
export type TaskEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:dismiss'
  | 'task:select'
  | 'task:timer'
  | 'task:reload'
  | 'task:show-image'
  | 'task:open-checklist'
  | 'task:open-journal'
  | 'task:open-voice-recorder';

export interface TaskEventPayloadMap {
  'task:create': Task;
  'task:update': { 
    taskId: string; 
    updates: Partial<Task>; 
  };
  'task:delete': { 
    taskId: string; 
    reason?: string; 
  };
  'task:complete': { 
    taskId: string; 
    metrics?: any; 
  };
  'task:dismiss': { 
    taskId: string; 
    habitId?: string; 
    date?: string; 
  };
  'task:select': string | null;
  'task:timer': { 
    taskId: string; 
    minutes: number; 
    notes?: string; 
  };
  'task:reload': undefined;
  'task:show-image': { 
    imageUrl: string; 
    taskName: string; 
  };
  'task:open-checklist': { 
    taskId: string; 
    taskName: string; 
    items: any[]; 
  };
  'task:open-journal': { 
    taskId: string; 
    taskName: string; 
    entry: string; 
  };
  'task:open-voice-recorder': { 
    taskId: string; 
    taskName: string; 
  };
}

// Journal event types
export type JournalEventType =
  | 'journal:open'
  | 'journal:save'
  | 'journal:close'
  | 'journal:get'
  | 'journal:list'
  | 'journal:create';

export interface JournalEventPayloadMap {
  'journal:open': {
    habitId?: string;
    habitName?: string;
    templateId?: string;
    description?: string;
    date?: string;
    taskId?: string;
  };
  'journal:save': {
    id?: string;
    content: string;
    date: string;
    habitId?: string;
    templateId?: string;
    journalType?: 'habit' | 'task';
  };
  'journal:close': undefined;
  'journal:get': {
    habitId: string;
    date: string;
  };
  'journal:list': {
    habitId?: string;
    limit?: number;
  };
  'journal:create': {
    habitId?: string;
    taskId?: string;
    title?: string;
    content: string;
    templateId?: string;
    date?: string;
  };
}

// Note event types
export type NoteEventType =
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'notes:refresh';

export interface NoteEventPayloadMap {
  'note:create': Note;
  'note:update': { 
    noteId: string; 
    updates: Partial<Note>; 
  };
  'note:delete': { 
    noteId: string; 
  };
  'note:select': string | null;
  'notes:refresh': undefined;
}

// Timer event types
export type TimerEventType =
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:complete'
  | 'timer:extend'
  | 'timer:reset'
  | 'timer:set-task'
  | 'timer:update-metrics'
  | 'timer:task-set'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:tick'
  | 'timer:init';

export interface TimerEventPayloadMap {
  'timer:start': { 
    taskId?: string; 
    taskName?: string;
    duration?: number;
  };
  'timer:pause': { 
    taskId?: string; 
    timeLeft: number;
    taskName?: string;
  };
  'timer:resume': {
    taskId?: string;
    timeLeft: number;
    taskName?: string;
  };
  'timer:complete': { 
    taskId?: string; 
    taskName?: string;
    metrics?: any;
  };
  'timer:extend': { 
    taskId?: string; 
    minutes: number;
    taskName?: string;
  };
  'timer:reset': { 
    taskId?: string;
    taskName?: string;
    duration?: number;
  };
  'timer:set-task': { 
    id: string; 
    name: string; 
    duration: number; 
    completed: boolean;
    createdAt: string;
    taskType?: string;
    taskId?: string;
  };
  'timer:update-metrics': { 
    taskId?: string; 
    taskName?: string;
    metrics: any;
  };
  'timer:task-set': {
    id: string;
    name: string;
    duration: number;
    taskId: string;
  };
  'timer:expand': {
    taskName?: string;
  };
  'timer:collapse': {
    taskName?: string;
    saveNotes?: boolean;
  };
  'timer:tick': {
    timeLeft: number;
    taskId?: string;
    taskName?: string;
  };
  'timer:init': {
    duration?: number;
    taskId?: string;
    taskName?: string;
  };
}

// Voice note event types
export type VoiceNoteEventType =
  | 'voice:start'
  | 'voice:stop'
  | 'voice:save'
  | 'voice:discard';

export interface VoiceNoteEventPayloadMap {
  'voice:start': { 
    taskId?: string;
    habitId?: string;
  };
  'voice:stop': undefined;
  'voice:save': { 
    url: string; 
    duration: number; 
    taskId?: string;
    habitId?: string;
  };
  'voice:discard': undefined;
}

// Relationship event types
export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete';

export interface RelationshipEventPayloadMap {
  'relationship:create': {
    sourceId: string;
    sourceType: string;
    targetId: string;
    targetType: string;
    metadata?: Record<string, any>;
  };
  'relationship:delete': {
    sourceId: string;
    targetId: string;
  };
}

// App event types
export type AppEventType =
  | 'app:init'
  | 'app:ready'
  | 'app:sync'
  | 'app:error';

export interface AppEventPayloadMap {
  'app:init': undefined;
  'app:ready': undefined;
  'app:sync': { status: 'start' | 'complete' | 'error' };
  'app:error': { message: string; code?: string; details?: any };
}

// Wildcard event type for catching all events
export type WildcardEventType = '*';

export interface WildcardEventPayloadMap {
  '*': {
    eventType: string;
    payload: any;
    timestamp: string;
  };
}

// Unified event types
export type EventType = 
  | HabitEventType 
  | TaskEventType 
  | JournalEventType 
  | NoteEventType 
  | TimerEventType 
  | VoiceNoteEventType 
  | RelationshipEventType 
  | AppEventType 
  | WildcardEventType;

// Combined event payload map
export interface EventPayloadMap extends 
  HabitEventPayloadMap, 
  TaskEventPayloadMap,
  JournalEventPayloadMap,
  NoteEventPayloadMap,
  TimerEventPayloadMap,
  VoiceNoteEventPayloadMap,
  RelationshipEventPayloadMap,
  AppEventPayloadMap,
  WildcardEventPayloadMap {}

// Helper type for getting the correct payload type for a given event
export type EventPayload<T extends EventType> = T extends keyof EventPayloadMap ? EventPayloadMap[T] : any;

// Type for event callbacks
export type EventCallback<T extends EventType> = (payload: EventPayload<T> & { timestamp?: string }) => void;

// Habit task event for habit-task integration
export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: MetricType;
}
