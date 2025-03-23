// Define all possible event types
export type TaskEventType = 
  | 'task:create' 
  | 'task:update' 
  | 'task:delete' 
  | 'task:complete' 
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss'
  | 'task:force-update';

export type HabitEventType = 
  | 'habit:dismissed' 
  | 'habit:tasks-sync' 
  | 'habit:progress-update'
  | 'habit:template-order-update'
  | 'habit:select'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-remove'
  | 'habit:template-days-update'
  | 'habit:check-pending'
  | 'habits:verify-tasks'
  | 'habits:check-pending'
  | 'habit:complete'
  | 'habit:schedule'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete';

export type TimerEventType = 
  | 'timer:tick' 
  | 'timer:complete'
  | 'timer:close'
  | 'timer:metrics-update'
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:reset'
  | 'timer:init'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics';

export type UIEventType = 
  | 'ui:sidebar-toggle' 
  | 'ui:theme-change';

export type SystemEventType = 
  | 'app:initialized' 
  | '*';

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
  | 'voice-note:deleted';

export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'tag:link'
  | 'tag:unlink'
  | 'quote:link-task';

export type JournalEventType =
  | 'journal:open';

// Combined type of all event types
export type EventType = 
  | TaskEventType 
  | HabitEventType 
  | TimerEventType 
  | UIEventType 
  | SystemEventType 
  | NoteEventType
  | VoiceNoteEventType
  | RelationshipEventType
  | JournalEventType;

// Define payload types for each event
export interface EventPayloadMap {
  // Task events
  'task:create': any;
  'task:update': { taskId: string; updates: any; reason?: string };
  'task:delete': { taskId: string; reason?: string; habitId?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string | null;
  'task:reload': undefined;
  'task:dismiss': { taskId: string; habitId?: string; date?: string };
  'task:force-update': any;

  // Habit events
  'habit:dismissed': { habitId: string; date: string };
  'habit:tasks-sync': any;
  'habit:progress-update': any;
  'habit:template-order-update': any;
  'habit:select': any;
  'habit:template-add': any;
  'habit:template-update': any;
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-remove': { templateId: string };
  'habit:template-days-update': any;
  'habit:check-pending': any;
  'habits:verify-tasks': any;
  'habits:check-pending': any;
  'habit:complete': { habitId: string; date: string; value: boolean | number; completed: boolean };
  'habit:schedule': { habitId: string; templateId: string; name: string; duration: number; date: string; metricType?: string };
  'habit:journal-complete': any;
  'habit:journal-deleted': any;
  'habit:custom-template-create': any;
  'habit:custom-template-delete': any;

  // Timer events
  'timer:tick': { timeLeft: number; taskName: string };
  'timer:complete': { taskId: string; taskName: string; metrics: any };
  'timer:close': { taskName: string };
  'timer:metrics-update': any;
  'timer:start': { taskId?: string; taskName: string; duration: number };
  'timer:pause': { taskId?: string; taskName: string; timeLeft: number };
  'timer:resume': { taskId?: string; taskName: string; timeLeft: number };
  'timer:reset': { taskId?: string; taskName: string; duration: number };
  'timer:init': { taskName: string; duration: number };
  'timer:set-task': { id: string; name: string; duration: number; completed: boolean; createdAt: string };
  'timer:task-set': any;
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:update-metrics': { taskId?: string; metrics: any; taskName?: string };

  // UI events
  'ui:sidebar-toggle': boolean;
  'ui:theme-change': 'light' | 'dark' | 'system';

  // System events
  'app:initialized': any;
  '*': { eventType: EventType; payload: any; timestamp: string };

  // Note events
  'note:create': any;
  'note:update': any;
  'note:deleted': any;
  'note:view': any;
  'note:format': any;
  'note:format-complete': any;
  'note:create-from-habit': any;
  'note:create-from-voice': any;

  // Voice note events
  'voice-note:created': any;
  'voice-note:deleted': any;

  // Relationship events
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
  'tag:link': any;
  'tag:unlink': any;
  'quote:link-task': any;

  // Journal events
  'journal:open': any;
}

// Helper type to extract the payload type for a specific event
export type EventPayload<E extends EventType> = E extends keyof EventPayloadMap 
  ? EventPayloadMap[E] 
  : any;

// Generic callback type for event handlers
export type EventCallback<E extends EventType> = (payload: EventPayload<E>) => void;

// Event unsubscribe function
export type EventUnsubscribe = () => void;
