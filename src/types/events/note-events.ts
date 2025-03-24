
/**
 * Note-related event types and payloads
 */
import { HabitNoteData } from './habit-events';

// Note event type definitions
export type NoteEventType =
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:create-from-habit'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-voice'
  | 'note:view'
  | 'note:deleted';

// Note event payload definitions
export interface NoteEventPayloadMap {
  'note:create': { id: string; title: string; content?: string };
  'note:update': { id: string; updates: any };
  'note:delete': { id: string };
  'note:select': { id: string };
  'note:create-from-habit': HabitNoteData;
  'note:format': { contentType: string };
  'note:format-complete': { formattedContent: string };
  'note:create-from-voice': { voiceNoteId: string };
  'note:view': { id: string; title: string };
  'note:deleted': { id: string };
}
