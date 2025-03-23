
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
  | 'timer:cancel'
  | 'timer:init'
  | 'timer:tick'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:close'
  | 'timer:task-set'
  | 'timer:metrics-update';

export type TaskEventType = 
  | 'task:create' 
  | 'task:update' 
  | 'task:delete' 
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'task:reload';

export type HabitEventType = 
  | 'habit:complete' 
  | 'habit:create' 
  | 'habit:update' 
  | 'habit:delete'
  | 'habit:schedule'
  | 'habit:dismissed'
  | 'habits:check-pending'
  | 'habits:processed'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:select'
  | 'habit:task-deleted'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:progress-update';

export type RelationshipEventType = 
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update';

export type AppEventType = 
  | 'app:initialized'
  | 'app:ready';

export type NavigationEventType = 
  | 'navigation:changed';

export type AuthEventType = 
  | 'auth:login'
  | 'auth:logout'
  | 'auth:signed-out'
  | 'auth:state-change';

export type NoteEventType = 
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:create-from-habit'
  | 'note:view'
  | 'note:deleted'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-voice';

export type TagEventType = 
  | 'tag:create'
  | 'tag:update'
  | 'tag:delete'
  | 'tag:link'
  | 'tag:unlink'
  | 'tags:force-update';

export type JournalEventType = 
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:open';

export type QuoteEventType = 
  | 'quote:favorite'
  | 'quote:unfavorite'
  | 'quote:link-task';

export type VoiceNoteEventType = 
  | 'voicenote:create'
  | 'voicenote:update'
  | 'voicenote:delete'
  | 'voice-note:created'
  | 'voice-note:deleted';

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
  'timer:start': { taskId?: string, duration?: number, taskName?: string };
  'timer:pause': { taskId?: string, timeLeft?: number, taskName?: string };
  'timer:resume': { taskId?: string, timeLeft?: number, taskName?: string };
  'timer:reset': { taskId?: string, taskName?: string, duration?: number };
  'timer:complete': { taskId?: string, metrics?: any, taskName?: string };
  'timer:add-time': { minutes: number, taskId?: string };
  'timer:set-task': Task;
  'timer:update-metrics': { taskId: string, metrics: any };
  'timer:cancel': { taskId?: string };
  'timer:init': { taskId?: string, duration?: number, taskName?: string };
  'timer:tick': { taskId?: string, remaining?: number, timeLeft?: number, taskName?: string };
  'timer:expand': any;
  'timer:collapse': any;
  'timer:close': any;
  'timer:task-set': any;
  'timer:metrics-update': { taskId?: string, metrics?: any, taskName?: string };
  
  // Task events
  'task:create': Task;
  'task:update': { taskId: string, updates: Partial<Task> };
  'task:delete': { taskId: string, reason?: string };
  'task:complete': { taskId: string, metrics?: any };
  'task:select': string | null;
  'task:dismiss': { taskId: string, reason?: string, habitId?: string, date?: string };
  'task:reload': any;
  
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
  
  // Relationship events
  'relationship:create': { type: string, sourceId: string, targetId: string };
  'relationship:delete': { type: string, sourceId: string, targetId: string };
  'relationship:update': any;
  'relationship:batch-update': any;
  
  // App events
  'app:initialized': { timestamp?: string };
  'app:ready': { timestamp?: string };
  
  // Navigation events
  'navigation:changed': { path: string };
  
  // Auth events
  'auth:login': { user?: any };
  'auth:logout': undefined;
  'auth:signed-out': any;
  'auth:state-change': { user: any | null };
  
  // Note events
  'note:create': { id?: string, title: string, content: string };
  'note:update': { id?: string, noteId?: string, updates: any };
  'note:delete': { noteId: string };
  'note:create-from-habit': { habitId: string, habitName: string, content: string, templateId?: string };
  'note:view': { id: string };
  'note:deleted': { id: string };
  'note:format': any;
  'note:format-complete': any;
  'note:create-from-voice': { audioUrl: string, transcript?: string };
  
  // Tag events
  'tag:create': { name: string, color?: string };
  'tag:update': { tagId: string, updates: any };
  'tag:delete': { tagId: string };
  'tag:link': { tagId: string, entityId: string, entityType: string };
  'tag:unlink': { tagId: string, entityId: string, entityType: string };
  'tags:force-update': any;
  
  // Journal events
  'journal:create': { title: string, content: string };
  'journal:update': { journalId: string, updates: any };
  'journal:delete': { journalId: string };
  'journal:open': any;
  
  // Quote events
  'quote:favorite': { quoteId: string };
  'quote:unfavorite': { quoteId: string };
  'quote:link-task': any;
  
  // Voice note events
  'voicenote:create': { audioUrl: string, text?: string, duration: number, noteId?: string };
  'voicenote:update': { voiceNoteId: string, updates: any, noteId?: string };
  'voicenote:delete': { voiceNoteId: string, noteId?: string };
  'voice-note:created': { noteId: string, voiceNoteId?: string };
  'voice-note:deleted': { noteId: string, voiceNoteId?: string };
}
