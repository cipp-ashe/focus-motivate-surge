
/**
 * Journal-specific event types and payloads
 */

export type JournalEventType =
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:complete'
  | 'journal:open';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  habitId?: string;
  taskId?: string;
  templateId?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface JournalEventPayloadMap {
  'journal:create': {
    habitId?: string;
    habitName?: string;
    taskId?: string;
    templateId?: string;
    title?: string;
    content?: string;
    date?: string;
  };
  'journal:update': {
    id: string;
    updates: Partial<JournalEntry>;
  };
  'journal:delete': {
    id: string;
  };
  'journal:complete': {
    id: string;
    habitId?: string;
    taskId?: string;
  };
  'journal:open': {
    habitId?: string;
    habitName?: string;
    description?: string;
    templateId?: string;
    taskId?: string;
    date?: string;
  };
}
