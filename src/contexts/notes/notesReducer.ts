
import { Note } from '@/types/notes';

// Action types
export type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null }
  | { type: 'SET_FILTER'; payload: string | null }
  | { type: 'SET_SORTING'; payload: { sortBy: 'createdAt' | 'updatedAt' | 'title'; direction: 'asc' | 'desc' } };

// State interface
export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
  filter: string | null;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortDirection: 'asc' | 'desc';
}

// Reducer function
export const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
      
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes]
      };
      
    case 'UPDATE_NOTE': {
      const { id, updates } = action.payload;
      const noteIndex = state.notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        return state;
      }
      
      const updatedNote = {
        ...state.notes[noteIndex],
        ...updates
      };
      
      const updatedNotes = [...state.notes];
      updatedNotes[noteIndex] = updatedNote;
      
      return {
        ...state,
        notes: updatedNotes
      };
    }
      
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
        selectedNoteId: state.selectedNoteId === action.payload ? null : state.selectedNoteId
      };
      
    case 'SELECT_NOTE':
      return {
        ...state,
        selectedNoteId: action.payload
      };
      
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
      
    case 'SET_SORTING':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.direction
      };
      
    default:
      return state;
  }
};
