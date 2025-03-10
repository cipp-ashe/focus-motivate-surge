
import { EntityType } from './core';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
  color?: string;
  archived?: boolean;
  pinned?: boolean;
  relationships?: {
    entityId: string;
    entityType: EntityType;
  }[];
}

export interface Tag {
  name: string;
  color: TagColor;
}

export type TagColor = 
  | 'default' 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'purple' 
  | 'pink';

export function isValidTagColor(color: string): color is TagColor {
  return ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].includes(color);
}

export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  filterTag: string | null;
}

export interface NotesProps {
  hideNotes?: boolean;
}
