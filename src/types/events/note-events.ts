
// Note domain event types

export type NoteEventType =
  | 'note:add'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'notes:clear';

export interface NoteEventPayloadMap {
  'note:add': {
    note: any;
  };
  'note:update': {
    id: string;
    updates: any;
  };
  'note:delete': {
    id: string;
    title: string;
  };
  'note:select': {
    id: string | null;
  };
  'notes:clear': {
    reason?: string;
  };
}
