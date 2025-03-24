
/**
 * Journal event types and payload definitions
 */

export type JournalEventType =
  | 'journal:open'
  | 'journal:save'
  | 'journal:close'
  | 'journal:get'
  | 'journal:list'
  | 'journal:create';

export interface JournalEventPayloadMap {
  'journal:open': {
    habitId?: string;
    habitName?: string;
    templateId?: string;
    description?: string;
    date?: string;
    taskId?: string;
  };
  'journal:save': {
    id?: string;
    content: string;
    date: string;
    habitId?: string;
    templateId?: string;
    journalType?: 'habit' | 'task';
  };
  'journal:close': undefined;
  'journal:get': {
    habitId: string;
    date: string;
  };
  'journal:list': {
    habitId?: string;
    limit?: number;
  };
  'journal:create': {
    habitId?: string;
    taskId?: string;
    title?: string;
    content: string;
    templateId?: string;
    date?: string;
  };
}
