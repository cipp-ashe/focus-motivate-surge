
// Note domain event types

export type NoteEventType =
  | 'note:add'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit'
  | 'note:create'
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
  };
  'notes:clear': {
    reason?: string;
  };
}
