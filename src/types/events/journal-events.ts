
/**
 * Journal-specific event types and payloads
 */

import { Note, Tag } from '@/types/notes';

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
    updates: Partial<Note>;
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
