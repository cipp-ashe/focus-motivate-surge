
import { EntityType } from './core';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  color?: string;
  archived?: boolean;
  pinned?: boolean;
  relationships?: {
    entityId: string;
    entityType: EntityType;
  }[];
}

export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  filterTag: string | null;
}
