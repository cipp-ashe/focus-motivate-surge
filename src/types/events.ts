
/**
 * Unified Events Type System
 * Single source of truth for all event-related types
 */

import { Task } from './task';
import { Note } from './note';
import { HabitCompletionEvent, TemplateUpdateEvent, DayOfWeek } from './habit';
import { TimerStateMetrics } from './timer';
import { EntityType, RelationType } from './core';

// Type for event unsubscribe function
export type EventUnsubscribe = () => void;

// Generic event callback interface
export interface EventCallback<T = any> {
  (payload: T): void;
}

// ===== Task Events =====

export type TaskEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'task:reload'
  | 'task:force-update'
  | 'task:show-image'
  | 'task:open-checklist'
  | 'task:open-journal'
  | 'task:open-voice-recorder'
  | 'task:open-voicenote'
  | 'task:timer';

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
  'task:select': string | null;
  'task:dismiss': {
    taskId: string;
    habitId?: string;
    date: string;
  };
  'task:reload': undefined;
  'task:force-update': undefined;
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
  'task:open-voicenote': {
    taskId: string;
    taskName: string;
  };
  'task:timer': {
    taskId: string;
    minutes: number;
    notes?: string;
  };
}

// ===== Note Events =====

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

// ===== Timer Events =====

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

// ===== Habit Events =====

export type HabitEventType =
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:template-update'
  | 'habit:template-add'
  | 'habit:template-delete'
  | 'habit:template-days-update'
  | 'habits:check-pending';

export interface HabitEventPayloadMap {
  'habit:complete': HabitCompletionEvent;
  'habit:dismiss': {
    habitId: string;
    date: string;
  };
  'habit:template-update': TemplateUpdateEvent;
  'habit:template-add': any; // Generic payload for template addition
  'habit:template-delete': {
    templateId: string;
    isOriginatingAction?: boolean;
  };
  'habit:template-days-update': {
    templateId: string;
    activeDays: DayOfWeek[];
  };
  'habits:check-pending': any;
}

// ===== Journal Events =====

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

// ===== Voice Note Events =====

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

// ===== Relationship Events =====

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

// ===== App Events =====

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

// ===== Wildcard Event =====

export type WildcardEventType = '*';

export interface WildcardEventPayloadMap {
  '*': {
    eventType: string;
    payload: any;
    timestamp: string;
  };
}

// ===== Unified Event Types =====

// Union of all event types
export type EventType = 
  | TaskEventType 
  | NoteEventType 
  | TimerEventType 
  | HabitEventType
  | JournalEventType
  | VoiceNoteEventType
  | RelationshipEventType
  | AppEventType
  | WildcardEventType;

// Combined payload map
export type EventPayloadMap = 
  & TaskEventPayloadMap 
  & NoteEventPayloadMap 
  & TimerEventPayloadMap 
  & HabitEventPayloadMap
  & JournalEventPayloadMap
  & VoiceNoteEventPayloadMap
  & RelationshipEventPayloadMap
  & AppEventPayloadMap
  & WildcardEventPayloadMap;

// Get the payload type for a specific event
export type EventPayload<E extends EventType> = E extends keyof EventPayloadMap 
  ? EventPayloadMap[E] 
  : never;
