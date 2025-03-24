
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
  // Timer events
  | 'timer:init'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics'
  | 'timer:close'
  // Habit events
  | 'habit:template-add'
  | 'habits:check-pending'
  | 'habit:complete'
  | 'habit:dismiss'
  // Note events
  | 'note:create'
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
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
}
