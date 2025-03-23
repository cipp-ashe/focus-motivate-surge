
// Define all possible event types
export type TaskEventType = 
  | 'task:create' 
  | 'task:update' 
  | 'task:delete' 
  | 'task:complete' 
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss';

export type HabitEventType = 
  | 'habit:dismissed' 
  | 'habit:tasks-sync' 
  | 'habit:progress-update'
  | 'habit:template-order-update'
  | 'habit:select'
  | 'habits:verify-tasks'
  | 'habits:check-pending';

export type TimerEventType = 
  | 'timer:tick' 
  | 'timer:complete'
  | 'timer:close'
  | 'timer:metrics-update';

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

// Combined type of all event types
export type EventType = 
  | TaskEventType 
  | HabitEventType 
  | TimerEventType 
  | UIEventType 
  | SystemEventType 
  | NoteEventType
  | VoiceNoteEventType
  | RelationshipEventType;

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

  // Habit events
  'habit:dismissed': { habitId: string; date: string };
  'habit:tasks-sync': any;
  'habit:progress-update': any;
  'habit:template-order-update': any;
  'habit:select': any;
  'habits:verify-tasks': any;
  'habits:check-pending': any;

  // Timer events
  'timer:tick': { timeLeft: number; taskName: string };
  'timer:complete': any;
  'timer:close': any;
  'timer:metrics-update': any;

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
}

// Helper type to extract the payload type for a specific event
export type EventPayload<E extends EventType> = E extends keyof EventPayloadMap 
  ? EventPayloadMap[E] 
  : any;

// Generic callback type for event handlers
export type EventCallback<E extends EventType> = (payload: EventPayload<E>) => void;

// Event unsubscribe function
export type EventUnsubscribe = () => void;
