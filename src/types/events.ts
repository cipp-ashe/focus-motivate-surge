
// Import and re-export all event types from the main events.ts
import type { Task } from './tasks';

// Event type constants
export type TimerEventType = 
  | 'timer:start' 
  | 'timer:pause' 
  | 'timer:resume' 
  | 'timer:reset' 
  | 'timer:complete' 
  | 'timer:add-time'
  | 'timer:set-task'
  | 'timer:update-metrics'
  | 'timer:cancel';

export type TaskEventType = 
  | 'task:create' 
  | 'task:update' 
  | 'task:delete' 
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss';

export type HabitEventType = 
  | 'habit:complete' 
  | 'habit:create' 
  | 'habit:update' 
  | 'habit:delete'
  | 'habit:schedule'
  | 'habit:dismissed'
  | 'habits:check-pending'
  | 'habits:processed';

export type RelationshipEventType = 
  | 'relationship:create'
  | 'relationship:delete';

export type AppEventType = 
  | 'app:initialized'
  | 'app:ready';

export type NavigationEventType = 
  | 'navigation:changed';

export type AuthEventType = 
  | 'auth:login'
  | 'auth:logout';

export type NoteEventType = 
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:create-from-habit';

export type TagEventType = 
  | 'tag:create'
  | 'tag:update'
  | 'tag:delete'
  | 'tag:link'
  | 'tag:unlink';

export type JournalEventType = 
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete';

export type QuoteEventType = 
  | 'quote:favorite'
  | 'quote:unfavorite';

export type VoiceNoteEventType = 
  | 'voicenote:create'
  | 'voicenote:update'
  | 'voicenote:delete';

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
  | JournalEventType
  | QuoteEventType
  | VoiceNoteEventType;

// Define payload types for each event
export interface EventPayloads {
  // Timer events
  'timer:start': { taskId?: string, duration?: number };
  'timer:pause': { taskId?: string };
  'timer:resume': { taskId?: string };
  'timer:reset': { taskId?: string };
  'timer:complete': { taskId?: string };
  'timer:add-time': { minutes: number, taskId?: string };
  'timer:set-task': Task;
  'timer:update-metrics': { taskId: string, metrics: any };
  'timer:cancel': { taskId?: string };
  
  // Task events
  'task:create': Task;
  'task:update': { taskId: string, updates: Partial<Task> };
  'task:delete': { taskId: string };
  'task:complete': { taskId: string, metrics?: any };
  'task:select': string | null;
  'task:dismiss': { taskId: string, reason?: string };
  
  // Habit events
  'habit:complete': { habitId: string, date: string, completed: boolean };
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
  
  // Relationship events
  'relationship:create': { type: string, sourceId: string, targetId: string };
  'relationship:delete': { type: string, sourceId: string, targetId: string };
  
  // App events
  'app:initialized': undefined;
  'app:ready': undefined;
  
  // Navigation events
  'navigation:changed': { path: string };
  
  // Auth events
  'auth:login': { userId: string };
  'auth:logout': undefined;
  
  // Note events
  'note:create': { title: string, content: string };
  'note:update': { noteId: string, updates: any };
  'note:delete': { noteId: string };
  'note:create-from-habit': { habitId: string, habitName: string, content: string, templateId?: string };
  
  // Tag events
  'tag:create': { name: string, color?: string };
  'tag:update': { tagId: string, updates: any };
  'tag:delete': { tagId: string };
  'tag:link': { tagId: string, entityId: string, entityType: string };
  'tag:unlink': { tagId: string, entityId: string, entityType: string };
  
  // Journal events
  'journal:create': { title: string, content: string };
  'journal:update': { journalId: string, updates: any };
  'journal:delete': { journalId: string };
  
  // Quote events
  'quote:favorite': { quoteId: string };
  'quote:unfavorite': { quoteId: string };
  
  // Voice note events
  'voicenote:create': { audioUrl: string, text?: string, duration: number };
  'voicenote:update': { voiceNoteId: string, updates: any };
  'voicenote:delete': { voiceNoteId: string };
}
