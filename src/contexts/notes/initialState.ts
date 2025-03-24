
// Define the Note type
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isArchived?: boolean;
  pinned?: boolean;
}

// Initial state for the notes context
export interface NoteState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
}

// Default initial state
export const initialState: NoteState = {
  notes: [],
  selectedNoteId: null,
  isLoading: false,
  error: null
};
