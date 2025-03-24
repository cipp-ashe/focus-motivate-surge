
/**
 * Journal-specific event types and payloads
 */

import { Note } from '@/types/notes';
import { Tag } from '@/types/notes';

export type JournalEventType =
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:complete'
  | 'journal:open';

// Standardized journal entry model (based on Note)
export interface JournalEntry extends Note {
  // Additional journal-specific fields
  habitId?: string;
  taskId?: string;
  templateId?: string;
  date: string;
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
    tags?: Tag[];
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
