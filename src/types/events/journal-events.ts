
/**
 * Journal-specific event types and payloads
 */

import { Note, Tag } from '@/types/notes';
import { EntityType } from '@/types/core';

export type JournalEventType =
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:complete'
  | 'journal:open';

// Standardized journal entry model (based on Note)
export interface JournalEntry extends Note {
  // Additional journal-specific fields
  taskId?: string;
  habitId?: string;
  templateId?: string;
  date: string; // ISO string date
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
    content?: string;
  };
}
