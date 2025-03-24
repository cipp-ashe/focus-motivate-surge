
// Define all possible event types in the application
export type EventType =
  // Task events
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'task:reload'
  | 'task:force-update'
  
  // Habit events
  | 'habit:schedule'
  | 'habit:complete'
  | 'habit:select'
  | 'habit:template-delete'
  | 'habit:template-update'
  | 'habit:check-pending'
  | 'habit:dismissed'
  | 'habits:check-pending'
  | 'habits:verify-tasks'
  | 'habits:tasks-sync'
  
  // Note events
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:create-from-habit'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-voice'
  
  // Timer events
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:tick'
  | 'timer:complete'
  | 'timer:reset'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:metrics-update'
  
  // Voice note events
  | 'voice-note:created'
  | 'voice-note:deleted'
  
  // Relationship events
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'tag:link'
  | 'tag:unlink'
  | 'quote:link-task'
  
  // App events
  | 'app:initialized';

// Define the base payload interface for events
export interface EventPayloadMap {
  // Task events
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string;
  'task:dismiss': { taskId: string; habitId: string; date: string };
  'task:reload': undefined;
  'task:force-update': undefined;
  
  // Habit events
  'habit:schedule': HabitTaskEvent;
  'habit:complete': { habitId: string; date: string; value: any };
  'habit:select': { habitId: string };
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-update': ActiveTemplate;
  'habit:check-pending': Record<string, any>;
  'habit:dismissed': { habitId: string; taskId: string; date: string };
  'habits:check-pending': Record<string, any>;
  'habits:verify-tasks': Record<string, any>;
  'habits:tasks-sync': Record<string, any>;
  
  // Note events
  'note:create': { id: string; title: string };
  'note:update': { id: string; updates: any };
  'note:delete': { id: string };
  'note:select': { id: string };
  'note:create-from-habit': HabitNoteData;
  'note:format': { contentType: string };
  'note:format-complete': { formattedContent: string };
  'note:create-from-voice': { voiceNoteId: string };
  
  // Timer events
  'timer:start': { taskId?: string; taskName: string; duration: number };
  'timer:pause': { taskId?: string; taskName: string; timeLeft: number };
  'timer:resume': { taskId?: string; taskName: string; timeLeft: number };
  'timer:tick': { timeLeft: number; taskName: string };
  'timer:complete': { taskId?: string; taskName: string; metrics: any };
  'timer:reset': { taskId?: string; taskName: string; duration?: number };
  'timer:set-task': { id: string; name: string; duration: number; taskId?: string };
  'timer:task-set': { id: string; name: string; duration: number; taskId?: string };
  'timer:metrics-update': Record<string, any>;
  
  // Voice note events
  'voice-note:created': { id: string; name: string; url: string; duration: number };
  'voice-note:deleted': { id: string };
  
  // Relationship events
  'relationship:create': { entityId: string; entityType: string; relatedEntityId: string; relatedEntityType: string };
  'relationship:delete': { entityId: string; entityType: string; relatedEntityId: string; relatedEntityType: string };
  'relationship:update': { entityId: string; entityType: string; updates: any };
  'relationship:batch-update': { entityId: string; entityType: string; relationships: any[] };
  'tag:link': { tagId: string; entityId: string; entityType: string };
  'tag:unlink': { tagId: string; entityId: string; entityType: string };
  'quote:link-task': { quoteId: string; taskId: string };
  
  // App events
  'app:initialized': { timestamp: number };
}

// Generic type to get the appropriate payload for a given event type
export type EventPayload<E extends EventType> = EventPayloadMap[E];

// Type for all event callbacks
export type EventCallback<E extends EventType> = (payload: EventPayloadMap[E]) => void;

// Type for HabitTaskEvent (needed for habit scheduling)
export interface HabitTaskEvent {
  habitId: string;
  name: string;
  duration: number;
  templateId: string;
  date: string;
  metricType?: string;
}

// Type for habit note data when creating notes from habits
export interface HabitNoteData {
  habitId: string;
  habitName: string;
  content: string;
  templateId?: string;
}

// Placeholder types referenced above (these should eventually be imported from their proper files)
type Task = any;
type ActiveTemplate = any;
