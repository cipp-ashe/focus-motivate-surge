
/**
 * Unified event types for the application
 */

// Define all possible event types as string literals
export type EventType = 
  // Habit events
  | 'habit:complete'
  | 'habit:update'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:schedule'
  | 'habits:verify-tasks'
  | 'habits:check-pending'
  | 'habit:template-add'
  | 'habit:dismissed'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete'
  | 'habit:tasks-sync'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:progress-update'
  | 'habit:template-order-update'
  | 'habit:select'
  
  // Task events
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss'
  | 'task:force-update'
  
  // Timer events
  | 'timer:start'
  | 'timer:complete'
  | 'timer:reset'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics'
  | 'timer:close'
  | 'timer:set-task'
  | 'timer:tick'
  | 'timer:metrics-update'
  | 'timer:init'
  | 'timer:task-set'
  
  // Note events
  | 'note:create'
  | 'note:update'
  | 'note:deleted'
  | 'note:view'
  | 'note:create-from-habit'
  | 'note:create-from-voice'
  | 'note:format'
  | 'note:format-complete'
  
  // Journal events
  | 'journal:open'
  
  // Voice note events
  | 'voice-note:created'
  | 'voice-note:deleted'
  
  // Auth events
  | 'auth:signed-out'
  
  // App events
  | 'app:initialized'
  
  // Relationship events
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'quote:link-task'
  
  // Wildcard for all events
  | '*';

/**
 * @deprecated Use EventType instead.
 * This will log an error when used with stack trace.
 */
export type AllEventTypes = string;

/**
 * Event payload types - maps event names to the expected payload structure
 */
export interface EventPayloads {
  // Habit events
  'habit:complete': { habitId: string; date: string; value: boolean | number; completed?: boolean };
  'habit:update': { habitId: string; updates: any };
  'habit:template-update': any;
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:schedule': { habitId: string; name: string; duration: number; templateId: string; date: string; metricType?: string };
  'habits:verify-tasks': any;
  'habits:check-pending': any;
  'habit:template-add': { id: string; templateId?: string };
  'habit:dismissed': { habitId: string; date?: string };
  'habit:custom-template-create': { id: string; name: string };
  'habit:custom-template-delete': { templateId: string };
  'habit:tasks-sync': { completed?: boolean };
  'habit:journal-complete': { habitId: string; templateId: string };
  'habit:journal-deleted': { habitId: string; templateId: string };
  'habit:progress-update': any;
  'habit:template-order-update': { templateIds: string[] };
  'habit:select': { habitId: string };
  
  // Task events
  'task:create': any;
  'task:update': { taskId: string; updates: any };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string | null;
  'task:reload': any;
  'task:dismiss': { taskId: string; habitId?: string; date?: string };
  'task:force-update': undefined;
  
  // Timer events
  'timer:start': { taskId?: string; taskName: string; duration: number; currentTime?: number };
  'timer:complete': { taskId?: string; taskName: string; metrics: any };
  'timer:reset': { taskId?: string; taskName: string; duration?: number };
  'timer:pause': { taskId?: string; taskName: string; timeLeft: number };
  'timer:resume': { taskId?: string; taskName: string; timeLeft: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:update-metrics': { taskId?: string; taskName?: string; metrics: any };
  'timer:close': { taskName: string };
  'timer:set-task': { id: string; name: string; duration: number; completed?: boolean; createdAt?: string; tags?: any[] };
  'timer:tick': { taskName?: string; timeLeft?: number; remaining?: number };
  'timer:metrics-update': { taskName: string; metrics: any };
  'timer:init': { taskName: string; duration?: number };
  'timer:task-set': { task: any };
  
  // Note events
  'note:create': { title?: string; content: string; id?: string };
  'note:update': { id: string; content: string };
  'note:deleted': { id: string };
  'note:view': { id: string };
  'note:create-from-habit': { habitId: string; habitName: string; content: string; templateId?: string };
  'note:create-from-voice': { voiceNoteId: string; content: string };
  'note:format': { contentType: string };
  'note:format-complete': { formattedContent: string };
  
  // Journal events
  'journal:open': { habitId: string; habitName: string; description?: string; templateId?: string };
  
  // Voice note events
  'voice-note:created': { id: string; url: string; taskId?: string };
  'voice-note:deleted': { id: string };
  
  // Auth events
  'auth:signed-out': { userId?: string };
  
  // App events
  'app:initialized': { timestamp: number };
  
  // Relationship events
  'relationship:create': { entity1Id: string; entity1Type: string; entity2Id: string; entity2Type: string; relationType: string };
  'relationship:delete': { relationId: string };
  'relationship:update': { relationId: string; updates: any };
  'relationship:batch-update': { entityId: string; entityType: string; relations: any[] };
  'quote:link-task': { quoteId: string; taskId: string };
  
  // Wildcard event
  '*': { type: EventType; payload: any };
}

// Type for event callback functions
export type EventCallback<T extends EventType> = (payload: EventPayloads[T]) => void;

/**
 * @deprecated Use EventCallback<T> from EventManager instead
 * This will log an error when used with stack trace.
 */
export type EventHandler<T = any> = (payload: T) => void;

// Update task event types for backwards compatibility
export type TaskEventType = Extract<EventType, 
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss'
  | 'task:force-update'
>;

// Update timer event types for backwards compatibility
export type TimerEventType = Extract<EventType,
  | 'timer:start'
  | 'timer:complete'
  | 'timer:reset'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics'
  | 'timer:close'
  | 'timer:set-task'
  | 'timer:tick'
  | 'timer:metrics-update'
  | 'timer:init'
  | 'timer:task-set'
>;

// Update habit event types for backwards compatibility
export type HabitEventType = Extract<EventType,
  | 'habit:complete'
  | 'habit:update'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:schedule'
  | 'habits:verify-tasks'
  | 'habits:check-pending'
  | 'habit:template-add'
  | 'habit:dismissed'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:progress-update'
>;

// Voice note event types
export type VoiceNoteEventType = Extract<EventType,
  | 'voice-note:created'
  | 'voice-note:deleted'
  | 'note:create-from-voice'
>;

// Helper type to get payload type for a specific event
export type EventPayload<T extends EventType> = T extends keyof EventPayloads 
  ? EventPayloads[T] 
  : any;
