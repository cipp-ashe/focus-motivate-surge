
/**
 * Unified event types for the application
 */

// Define all possible event types as string literals
export type EventType = 
  | 'habit:complete'
  | 'habit:update'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:schedule'
  | 'habits:verify-tasks'
  | 'habits:check-pending'
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss'
  | 'task:force-update'
  | 'timer:start'
  | 'timer:complete'
  | 'timer:reset'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics'
  | 'timer:close'
  | 'tag:link'
  | 'tag:unlink'
  | 'habit:check-pending'
  | '*'  // Special wildcard type for listening to all events

/**
 * DEPRECATED: Use EventType instead
 * This will log an error when used.
 */
export type AllEventTypes = string;

/**
 * Event payload types - maps event names to the expected payload structure
 */
export interface EventPayloads {
  // Habit events
  'habit:complete': { habitId: string; date: string; value: boolean | number };
  'habit:update': { habitId: string; updates: any };
  'habit:template-update': any;
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:schedule': { habitId: string; name: string; duration: number; templateId: string; date: string };
  'habits:verify-tasks': any;
  'habits:check-pending': any;
  
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
  'timer:start': { taskId: string; taskName: string; duration: number };
  'timer:complete': { taskId: string; taskName: string; metrics: any };
  'timer:reset': { taskId: string; taskName: string };
  'timer:pause': { taskId: string; taskName: string; timeLeft: number };
  'timer:resume': { taskId: string; taskName: string; timeLeft: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:update-metrics': { taskId: string; metrics: any; taskName?: string };
  'timer:close': { taskName: string };
  
  // Tag events
  'tag:link': { tagId: string; entityId: string; entityType: 'task' | 'note' };
  'tag:unlink': { tagId: string; entityId: string; entityType: 'task' | 'note' };
  
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
>;
