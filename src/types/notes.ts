/**
 * Notes Types
 */

import { EntityType } from './core';

export type NoteType = 'standard' | 'journal' | 'task' | 'habit' | 'markdown';

export interface NoteTag {
  id: string;
  name: string;
  color?: TagColor;
}

export type TagColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'teal';

export type NoteSortOption = 'createdAt' | 'updatedAt' | 'title' | 'type';
export type NoteSortDirection = 'asc' | 'desc';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  createdAt: string;
  updatedAt: string;
  tags: NoteTag[];
  pinned?: boolean;
  archived?: boolean;
  favorite?: boolean;
  color?: string;
  relationships?: NoteRelationships;
}

export interface NoteRelationships {
  taskId?: string;
  habitId?: string;
  templateId?: string;
  journalId?: string;
  projectId?: string;
  [key: string]: string | undefined;
}

// Note Events
export interface NoteEvents {
  'note:create': Note;
  'note:update': { id: string; updates: Partial<Note> };
  'note:delete': { id: string; reason?: string };
  'note:select': string | null;
  'note:tags:update': { noteId: string; tags: NoteTag[] };
  'note:archive': { id: string };
  'note:unarchive': { id: string };
  'note:pin': { id: string };
  'note:unpin': { id: string };
  'notes:refresh': void;
}
