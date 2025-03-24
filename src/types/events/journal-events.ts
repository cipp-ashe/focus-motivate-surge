
/**
 * Journal-specific event types and payloads
 */

import { Note, Tag } from '@/types/notes';

// We'll unify journal entries as extended notes
export interface JournalEntry extends Note {
  // Additional journal-specific fields
  habitId?: string;
  taskId?: string;
  templateId?: string;
  date: string; // ISO string date
}

export type JournalEventType =
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:complete'
  | 'journal:open';

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
    content?: string;
  };
}
