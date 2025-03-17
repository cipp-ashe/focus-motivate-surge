
// Type definitions for all event types used in the application
// This ensures type safety when emitting and listening for events

export type TaskEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss'; // Added missing task:dismiss

export type HabitEventType =
  | 'habit:complete'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habits:check-pending'
  | 'habit:schedule'         // Added missing habit:schedule
  | 'habit:dismissed'        // Added missing habit:dismissed
  | 'habit:journal-deleted'  // Added missing habit:journal-deleted
  | 'habit:task-deleted'     // Added missing habit:task-deleted
  | 'habit:select';          // Added missing habit:select

export type TimerEventType =
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:task-set'
  | 'timer:tick'            // Added missing timer:tick
  | 'timer:init'            // Added missing timer:init
  | 'timer:close'           // Added missing timer:close
  | 'timer:expand'          // Added missing timer:expand
  | 'timer:collapse'        // Added missing timer:collapse
  | 'timer:metrics-update'  // Added missing timer:metrics-update
  | 'timer:set-task';       // Added missing timer:set-task

export type NoteEventType =
  | 'note:create'
  | 'note:update'
  | 'note:deleted'
  | 'note:view'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit'
  | 'note:create-from-voice';

export type VoiceNoteEventType =
  | 'voice-note:created'
  | 'voice-note:deleted'
  | 'voice-note:updated';

export type AuthEventType =
  | 'auth:signed-in'
  | 'auth:signed-out'
  | 'auth:state-change';

export type AppEventType =
  | 'app:initialized'
  | 'app:route-changed';

// Adding new event types for relationships, tags, journals, and quotes
export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update';

export type TagEventType =
  | 'tag:link'
  | 'tag:unlink'
  | 'tags:force-update';

export type JournalEventType =
  | 'journal:open';

export type QuoteEventType =
  | 'quote:link-task';

export type NavigationEventType =
  | 'nav:route-change';

// Union type of all event types for the event bus
export type AllEventTypes =
  | TaskEventType
  | HabitEventType
  | TimerEventType
  | NoteEventType
  | VoiceNoteEventType
  | AuthEventType
  | AppEventType
  | RelationshipEventType
  | TagEventType
  | JournalEventType
  | QuoteEventType
  | NavigationEventType;

// Define the EventPayloads interface to map event types to their payload types
export interface EventPayloads {
  // Task events
  'task:create': any;
  'task:update': { taskId: string; updates: any };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string;
  'task:reload': any;
  'task:dismiss': { taskId: string; habitId: string; date: string };

  // Habit events
  'habit:complete': { habitId: string; completed: boolean };
  'habit:template-add': { id: string; templateId: string };
  'habit:template-update': any;
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habits:check-pending': any;
  'habit:schedule': any;
  'habit:dismissed': { habitId: string; date: string };
  'habit:journal-deleted': { habitId: string };
  'habit:task-deleted': { habitId: string; taskId: string };
  'habit:select': string;

  // Timer events
  'timer:start': { taskName: string; duration: number };
  'timer:pause': { taskName: string; timeLeft?: number };
  'timer:resume': { taskName: string; timeLeft?: number };
  'timer:reset': { taskName: string; duration?: number };
  'timer:complete': { taskName: string; metrics: any };
  'timer:task-set': any;
  'timer:tick': { timeLeft: number; taskName: string; remaining?: number };
  'timer:init': { taskName: string; duration: number };
  'timer:close': { taskName: string };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes?: boolean };
  'timer:metrics-update': { taskName: string; metrics: any };
  'timer:set-task': any;

  // Note events
  'note:create': { id: string; title: string; content: string };
  'note:update': { id: string; updates: any };
  'note:deleted': { id: string };
  'note:view': { id: string };
  'note:format': { id: string; format: string };
  'note:format-complete': { id: string; format: string };
  'note:create-from-habit': any;
  'note:create-from-voice': { audioUrl: string; transcript?: string };

  // Voice note events
  'voice-note:created': { noteId: string };
  'voice-note:deleted': { noteId: string };
  'voice-note:updated': { noteId: string; updates: any };

  // Auth events
  'auth:signed-in': { user: any };
  'auth:signed-out': any;
  'auth:state-change': { user: any };

  // App events
  'app:initialized': { timestamp: string };
  'app:route-changed': { path: string };

  // Relationship events
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;

  // Tag events
  'tag:link': any;
  'tag:unlink': any;
  'tags:force-update': { timestamp: string };

  // Journal events
  'journal:open': any;

  // Quote events
  'quote:link-task': any;

  // Navigation events
  'nav:route-change': any;
}

