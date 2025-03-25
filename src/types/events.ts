
/**
 * Event System Types
 */

// Event types enum
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

// Event payload type
export type EventPayload<E extends EventType> = any;

// Event callback type
export type EventCallback<E extends EventType> = (payload: EventPayload<E>) => void;

// Event unsubscribe function
export type EventUnsubscribe = () => void;

// Habit task event
export interface HabitTaskEvent {
  habitId: string;
  date: string;
  templateId?: string;
  taskId?: string;
}

// Journal entry
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
