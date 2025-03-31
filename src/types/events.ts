
/**
 * Event System Types
 * 
 * A centralized type definition for all application events,
 * ensuring type safety across the event system.
 */

// Event types enum - use literal string union for better type checking
export type EventType =
  // Core events
  | '*'
  // Task events
  | 'task:create'
  | 'task:update' 
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:reload'
  | 'task:force-update'
  | 'task:add'
  | 'task:dismiss'
  | 'task:show-image'
  | 'task:open-checklist'
  | 'task:open-journal'
  | 'task:open-voice-recorder'
  | 'task:timer'
  // Timer events
  | 'timer:init'
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:tick'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics'
  | 'timer:close'
  | 'timer:set-task'
  | 'timer:reset'
  | 'timer:complete'
  // Habit events
  | 'habit:template-add'
  | 'habits:check-pending'
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:schedule'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:custom-template-create'
  | 'habit:note-create'
  | 'habit:journal-create'
  // Journal events
  | 'journal:open'
  | 'journal:save'
  | 'journal:create'
  // Note events
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:tags:update'
  | 'note:archive'
  | 'note:unarchive'
  | 'note:pin'
  | 'note:unpin'
  | 'notes:refresh'
  // Relationship events
  | 'relationship:create'
  | 'relationship:delete';

// Type-safe event payload mapping
export interface EventPayloadMap {
  // Task events
  'task:create': { id: string; name: string; [key: string]: any };
  'task:update': { taskId: string; updates: any };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string | null;
  'task:reload': undefined;
  'task:dismiss': { taskId: string; habitId?: string; date?: string };
  'task:show-image': { imageUrl: string; taskName: string };
  'task:open-checklist': { taskId: string; taskName: string; items: any[] };
  'task:open-journal': { taskId: string; taskName: string; entry: string };
  'task:open-voice-recorder': { taskId: string; taskName: string };
  
  // Timer events
  'timer:set-task': { id: string; name: string; duration: number; [key: string]: any };
  
  // Habit events
  'habit:complete': { habitId: string; date: string; value?: any; metricType?: string; habitName?: string; templateId?: string };
  'habit:dismiss': { habitId: string; date: string };
  'habits:check-pending': any;
  'habit:schedule': { habitId: string; templateId: string; name: string; duration: number; date: string; metricType?: string };
  
  // Journal events
  'journal:open': { habitId?: string; habitName?: string; description?: string; templateId?: string; date?: string };
  
  // Default catch-all for any other events
  [key: string]: any;
}

// Generic event payload type with type safety
export type EventPayload<E extends EventType> = E extends keyof EventPayloadMap 
  ? EventPayloadMap[E] 
  : any;

// Event callback type with payload type inference
export type EventCallback<E extends EventType> = (payload: EventPayload<E>) => void;

// Event unsubscribe function type
export type EventUnsubscribe = () => void;

// Common event interfaces
export interface HabitTaskEvent {
  habitId: string;
  name: string;
  duration: number;
  date: string;
  templateId?: string;
  taskId?: string;
  metricType?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  habitId?: string;
  taskId?: string;
  templateId?: string;
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
}
