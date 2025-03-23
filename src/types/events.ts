
import { Task } from '@/types/tasks';

// Define consistent event type categories
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

// Define payload types for each event
export interface EventPayloads {
  [key: string]: any;
  // Auth events
  'auth:state-change': { user: any | null };
  'auth:login': { user?: any };
  'auth:logout': undefined;
  'auth:signed-out': any;

  // Timer events
  'timer:start': { taskId?: string, duration?: number, taskName?: string };
  'timer:pause': { taskId?: string, timeLeft?: number, taskName?: string };
  'timer:resume': { taskId?: string, timeLeft?: number, taskName?: string };
  'timer:reset': { taskId?: string, taskName?: string, duration?: number };
  'timer:complete': { taskId?: string, metrics?: any, taskName?: string };
  'timer:add-time': { minutes: number, taskId?: string };
  'timer:set-task': Task;
  'timer:update-metrics': { taskId: string, metrics: any };
  'timer:tick': { taskId?: string, remaining?: number, timeLeft?: number, taskName?: string };
  'timer:expand': any;
  'timer:collapse': any;
  'timer:close': any;
  'timer:task-set': any;
  
  // Task events
  'task:create': Task;
  'task:update': { taskId: string, updates: Partial<Task> };
  'task:delete': { taskId: string, reason?: string };
  'task:complete': { taskId: string, metrics?: any };
  'task:select': string | null;
  'task:dismiss': { taskId: string, reason?: string, habitId?: string, date?: string };
  
  // Habit events
  'habit:complete': { habitId: string, date: string, completed?: boolean };
  'habit:create': { habitId: string, habitData: any };
  'habit:update': { habitId: string, updates: any };
  'habit:delete': { habitId: string };
  'habit:schedule': { 
    habitId: string, 
    templateId: string, 
    name: string, 
    duration: number, 
    date: string,
    metricType?: string 
  };
  'habit:dismissed': { habitId: string, date: string };
  'habits:check-pending': any;
  'habits:processed': any[];
  'habit:template-add': { id: string, templateId: string, [key: string]: any };
  'habit:template-update': any;
  'habit:template-delete': { templateId: string, isOriginatingAction?: boolean };
  'habit:select': any;
  'habit:task-deleted': any;
  
  // Note events
  'note:create': { id?: string, title: string, content: string };
  'note:update': { id?: string, noteId?: string, updates: any };
  'note:delete': { noteId: string };
  'note:create-from-habit': { habitId: string, habitName: string, content: string, templateId?: string };
  'note:view': { id: string };
  'note:deleted': { id: string };
  
  // Voice note events
  'voicenote:create': { audioUrl: string, text?: string, duration: number, noteId?: string };
  'voicenote:update': { voiceNoteId: string, updates: any, noteId?: string };
  'voicenote:delete': { voiceNoteId: string, noteId?: string };
  'voice-note:created': { noteId: string, voiceNoteId?: string };
  'voice-note:deleted': { noteId: string, voiceNoteId?: string };
  
  // Tag events
  'tag:create': { name: string, color?: string };
  'tag:update': { tagId: string, updates: any };
  'tag:delete': { tagId: string };
  'tag:link': { tagId: string, entityId: string, entityType: string };
  'tag:unlink': { tagId: string, entityId: string, entityType: string };
  
  // Relationship events
  'relationship:create': { type: string, sourceId: string, targetId: string };
  'relationship:delete': { type: string, sourceId: string, targetId: string };
  'relationship:update': any;
  'relationship:batch-update': any;
  
  // App and navigation events
  'app:initialized': { timestamp?: string };
  'app:ready': { timestamp?: string };
  'navigation:changed': { path: string };
  
  // Journal and quote events
  'journal:open': any;
  'quote:favorite': { quoteId: string };
  'quote:unfavorite': { quoteId: string };
  'quote:link-task': any;
}

// Type for event handlers
export type EventHandler<T = any> = (payload: T) => void;
