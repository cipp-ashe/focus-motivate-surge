/**
 * Event types supported by the event system
 */
export type EventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:prioritize'
  | 'task:complete'
  | 'task:select'
  | 'task:clear-selection'
  | 'task:reschedule'
  | 'task:search'
  | 'task:filter'
  | 'task:clear-filters'
  | 'task:schedule'
  | 'task:unschedule'
  | 'task:mark-in-progress'
  | 'task:postpone'
  | 'task:reorder'
  | 'task:reload'
  | 'task:dismiss'
  | 'task:force-update'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:complete'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:restart'
  | 'timer:add-time'
  | 'timer:set-duration'
  | 'timer:update-progress'
  | 'timer:set-metrics'
  | 'timer:update-metrics'
  | 'timer:tick'
  | 'timer:start'
  | 'timer:reset'
  | 'timer:init'
  | 'timer:close'
  | 'timer:expand'
  | 'timer:collapse'
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:schedule'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-remove'
  | 'habit:template-delete'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete'
  | 'habits:check-pending'
  | 'journal:open'
  | 'journal:save'
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:export'
  | 'note:view'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit'
  | 'note:deleted';

export type EventCallback<T = any> = (payload: T) => void;

export type EventUnsubscribe = () => void;

// Define payload types for event listeners
export interface EventPayloadMap {
  // Task events
  'task:create': any;
  'task:update': { taskId: string; updates: any; reason?: string };
  'task:delete': { taskId: string; reason?: string; habitId?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string | null;
  'task:reload': any;
  'task:dismiss': { taskId: string; habitId?: string; date?: string };
  'task:force-update': any;
  'task:prioritize': any;
  'task:clear-selection': any;
  'task:reschedule': any;
  'task:search': any;
  'task:filter': any;
  'task:clear-filters': any;
  'task:schedule': any;
  'task:unschedule': any;
  'task:mark-in-progress': any;
  'task:postpone': any;
  'task:reorder': any;
  
  // Timer events
  'timer:tick': { timeLeft: number; taskName: string };
  'timer:complete': { taskId?: string; taskName: string; metrics: any };
  'timer:close': { taskName: string };
  'timer:start': { taskId?: string; taskName: string; duration: number };
  'timer:pause': { taskId?: string; taskName: string; timeLeft: number };
  'timer:resume': { taskId?: string; taskName: string; timeLeft: number };
  'timer:reset': { taskId?: string; taskName: string; duration?: number };
  'timer:init': { taskName: string; duration: number };
  'timer:set-task': { id: string; name: string; duration: number; completed?: boolean; createdAt?: string };
  'timer:task-set': { id: string; name: string; duration: number; taskId: string };
  'timer:update-metrics': { taskId?: string; metrics: any; taskName?: string };
  'timer:restart': any;
  'timer:add-time': any;
  'timer:set-duration': any;
  'timer:update-progress': any;
  'timer:set-metrics': any;
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes?: boolean };
  
  // Habit events
  'habit:complete': { habitId: string; date: string; value: boolean | number; completed: boolean };
  'habit:dismiss': { habitId: string; date: string; value?: boolean | number; dismissed: boolean };
  'habit:schedule': { habitId: string; templateId: string; name: string; duration: number; date: string; metricType?: string };
  'habit:template-add': { templateId: string };
  'habit:template-update': any;
  'habit:template-remove': { templateId: string };
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-days-update': any;
  'habit:template-order-update': any;
  'habit:custom-template-create': any;
  'habit:custom-template-delete': { templateId: string };
  'habits:check-pending': any;
  
  // Journal events
  'journal:open': { habitId?: string; habitName?: string; description?: string; templateId?: string };
  'journal:save': any;
  
  // Note events
  'note:create': any;
  'note:update': { id: string; updates: any };
  'note:delete': { id: string };
  'note:select': { id: string; title: string };
  'note:export': any;
  'note:view': any;
  'note:format': any;
  'note:format-complete': any;
  'note:create-from-habit': any;
  'note:deleted': any;
}

// Helper type to extract the payload type for a specific event
export type EventPayload<E extends EventType> = E extends keyof EventPayloadMap 
  ? EventPayloadMap[E] 
  : any;
