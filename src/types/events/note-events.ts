
/**
 * Note event types and payload definitions
 */

import { Note } from '@/types/notes';

export type NoteEventType =
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'notes:refresh';

export interface NoteEventPayloadMap {
  'note:create': Note;
  'note:update': { 
    noteId: string; 
    updates: Partial<Note>; 
  };
  'note:delete': { 
    noteId: string; 
  };
  'note:select': string | null;
  'notes:refresh': undefined;
}
