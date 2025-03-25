
import { Note } from '@/types/notes';

// Define state interface
export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
  filter: string | null;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortDirection: 'asc' | 'desc';
}

// Define action types
type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null }
  | { type: 'SET_FILTER'; payload: string | null }
  | { type: 'SET_SORTING'; payload: { sortBy: 'createdAt' | 'updatedAt' | 'title'; direction: 'asc' | 'desc' } };

// Reducer function
export const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
        isLoading: false
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        selectedNoteId: action.payload.id // Auto-select the newly created note
      };
      
    case 'UPDATE_NOTE': {
      const { id, updates } = action.payload;
      
      const updatedNotes = state.notes.map(note => 
        note.id === id ? { ...note, ...updates } : note
      );
      
      return {
        ...state,
        notes: updatedNotes
      };
    }
      
    case 'DELETE_NOTE': {
      const updatedNotes = state.notes.filter(note => note.id !== action.payload);
      
      // If the deleted note was selected, clear selection
      const updatedSelectedNoteId = 
        state.selectedNoteId === action.payload 
          ? null 
          : state.selectedNoteId;
      
      return {
        ...state,
        notes: updatedNotes,
        selectedNoteId: updatedSelectedNoteId
      };
    }
      
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
