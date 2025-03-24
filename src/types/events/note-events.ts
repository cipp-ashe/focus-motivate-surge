
// Note domain event types
import { Note, Tag } from '@/types/notes';

export type NoteEventType =
  | 'note:add'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit'
  | 'note:create'
  | 'note:view'
  | 'note:deleted'
  | 'notes:clear';

export interface NoteEventPayloadMap {
  'note:add': {
    note: Note;
  };
  'note:update': {
    id: string;
    updates: Partial<Note>;
  };
  'note:delete': {
    id: string;
  };
  'note:select': {
    id: string | null;
  };
  'note:format': {
    contentType: string;
  };
  'note:format-complete': {
    formattedContent: string;
  };
  'note:create-from-habit': {
    habitId: string;
    habitName: string;
    content: string;
    templateId?: string;
  };
  'note:create': {
    id: string;
    title: string;
    content: string;
    tags?: Tag[];
  };
  'note:view': {
    id: string;
    title: string;
  };
  'note:deleted': {
    id: string;
  };
  'notes:clear': {
    reason?: string;
  };
}
