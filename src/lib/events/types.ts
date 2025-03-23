
// Event system types

// Define all possible event types in the system
export type EventType = 
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:selected'
  | 'note:bookmark'
  | 'note:unbookmark'
  | 'note:create-from-habit'
  | 'note:format'
  | 'note:format-complete'
  | 'note:view'
  | 'note:deleted'
  | 'note:create-from-voice'
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:uncomplete'
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-order-update'
  | 'habit:progress-update'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:custom-template-create'
  | 'habit:custom-template-delete'
  | 'habit:schedule'
  | 'habits:check-pending'
  | 'habit:complete'
  | 'habit:dismissed'
  | 'habit:task-deleted'
  | 'habit:select'
  | 'journal:open'
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'tag:link'
  | 'tag:unlink'
  | 'tags:force-update'
  | 'quote:link-task'
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:tick'
  | 'timer:init'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:close'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:metrics-update'
  | 'voice-note:created'
  | 'voice-note:deleted'
  | 'auth:signed-out'
  | 'auth:logout'
  | 'app:initialized'
  | 'focus:session-start'
  | 'focus:session-end'
  | 'focus:session-complete';

// Type for event payload mapping
export interface EventPayloads {
  'note:create': { id: string; title: string; content: string };
  'note:update': { id: string; title?: string; content?: string };
  'note:delete': { id: string };
  'note:selected': { id: string | null };
  'note:bookmark': { id: string };
  'note:unbookmark': { id: string };
  'note:create-from-habit': { habitId: string; templateId: string; title: string; content: string };
  'note:format': { id: string; format: string };
  'note:format-complete': { id: string; format: string };
  'note:view': { id: string };
  'note:deleted': { noteId: string };
  'note:create-from-voice': { title: string; content: string; audioUrl?: string };
  'task:create': { id: string; name: string; description?: string; completed?: boolean; duration?: number };
  'task:update': { taskId: string; updates: any };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:uncomplete': { taskId: string };
  'task:select': string | null;
  'task:reload': Record<string, never>;
  'task:dismiss': { taskId: string };
  'habit:template-add': { id: string; templateId: string };
  'habit:template-update': { templateId: string; [key: string]: any };
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-order-update': any[];
  'habit:progress-update': { habitId: string; templateId: string; value: boolean | number; date: string };
  'habit:journal-complete': { habitId: string; templateId: string };
  'habit:journal-deleted': { habitId: string; templateId: string };
  'habit:custom-template-create': { id: string; name: string; [key: string]: any };
  'habit:custom-template-delete': { templateId: string; suppressToast?: boolean };
  'habit:schedule': { habitId: string; templateId: string; name: string; duration: number; date: string; metricType?: string };
  'habits:check-pending': Record<string, never>;
  'habit:complete': { habitId: string; completed: boolean; date?: string };
  'habit:dismissed': { habitId: string; date: string };
  'habit:task-deleted': { habitId: string; date: string };
  'habit:select': { habitId: string };
  'journal:open': { habitId: string; templateId: string };
  'relationship:create': { sourceId: string; sourceType: string; targetId: string; targetType: string; type: string };
  'relationship:delete': { sourceId: string; sourceType: string; targetId: string; targetType: string };
  'relationship:update': { sourceId: string; targetId: string; updates: any };
  'relationship:batch-update': any[];
  'tag:link': { tagId: string; entityId: string; entityType: string };
  'tag:unlink': { tagId: string; entityId: string };
  'tags:force-update': { timestamp: string };
  'quote:link-task': { quoteId: string; taskId: string };
  'timer:start': { taskName: string; duration: number };
  'timer:pause': { taskName: string; timeLeft: number };
  'timer:resume': { taskName: string; timeLeft: number };
  'timer:reset': { taskName: string; duration: number };
  'timer:complete': { taskName: string; metrics: any };
  'timer:tick': { taskName: string; timeLeft: number; remaining?: number };
  'timer:init': { taskName: string; duration: number };
  'timer:expand': { taskName: string; saveNotes?: boolean };
  'timer:collapse': { taskName: string };
  'timer:close': { taskName: string };
  'timer:set-task': { id: string; name: string; duration: number };
  'timer:task-set': { id: string; name: string; duration: number };
  'timer:metrics-update': { taskName: string; metrics: any };
  'voice-note:created': { id: string; title: string; audioUrl: string; duration: number };
  'voice-note:deleted': { id: string };
  'auth:signed-out': Record<string, never>;
  'auth:logout': Record<string, never>;
  'app:initialized': Record<string, never>;
  'focus:session-start': { id: string; duration: number };
  'focus:session-end': { id: string; completed: boolean };
  'focus:session-complete': { id: string };
}

// Type for event handlers
export type EventHandler<T extends EventType> = (payload: EventPayloads[T]) => void;

// Type for all allowed event types (used for runtime validation)
export type AllEventTypes = EventType;
