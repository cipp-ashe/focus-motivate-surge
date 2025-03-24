
import { TagColor } from '@/types/notes';
import { EntityType } from '@/types/core';

// Define the Note type
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  relationships?: {
    entityId: string;
    entityType: EntityType;
  }[];
}

// Define the Tag type
export interface Tag {
  name: string;
  color: TagColor;
}

// Define the initial state
export interface NoteState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
}

// Set the initial state
export const initialState: NoteState = {
  notes: [],
  selectedNoteId: null,
  isLoading: false,
  error: null
};
