
// Event system types

// Define all possible event types in the system
export type EventType = 
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:selected'
  | 'note:bookmark'
  | 'note:unbookmark'
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:uncomplete'
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
  | 'relationship:create'
  | 'relationship:delete'
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
  'task:create': { id: string; title: string };
  'task:update': { id: string; title?: string; completed?: boolean };
  'task:delete': { id: string };
  'task:complete': { id: string };
  'task:uncomplete': { id: string };
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
  'relationship:create': { sourceId: string; sourceType: string; targetId: string; targetType: string; type: string };
  'relationship:delete': { sourceId: string; sourceType: string; targetId: string; targetType: string };
  'focus:session-start': { id: string; duration: number };
  'focus:session-end': { id: string; completed: boolean };
  'focus:session-complete': { id: string };
}

// Type for event handlers
export type EventHandler<T extends EventType> = (payload: EventPayloads[T]) => void;

// Type for all allowed event types (used for runtime validation)
export type AllEventTypes = EventType;
