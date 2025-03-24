
import { Note } from '@/types/notes';
import { deprecate } from '@/utils/deprecation';

// Define the state shape
export interface NoteState {
  notes: Note[];
  selectedNoteId: string | null;
}

// Define the action types
type NoteAction =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SELECT_NOTE'; payload: string | null }
  // Legacy action types
  | { type: 'SET_SELECTED_NOTE'; payload: string | null }
  | { type: 'DELETE_NOTE'; payload: { id: string; title: string } };

// Reducer function to handle state changes
export const noteReducer = (state: NoteState, action: NoteAction): NoteState => {
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      };

    case 'DELETE_NOTE':
      // Handle both new and legacy payload formats
      const deleteId = typeof action.payload === 'string' 
        ? action.payload
        : action.payload.id;
      
      // Log deprecation warning for old format
      if (typeof action.payload !== 'string') {
        deprecate(
          'noteReducer', 
          'DELETE_NOTE with object payload', 
          'Use string ID as payload instead'
        );
      }
      
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== deleteId),
        selectedNoteId: state.selectedNoteId === deleteId ? null : state.selectedNoteId,
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : note
        ),
      };

    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
      };

    case 'SELECT_NOTE':
      return {
        ...state,
        selectedNoteId: action.payload,
      };
      
    // Handle legacy action type
    case 'SET_SELECTED_NOTE':
      deprecate(
        'noteReducer', 
        'SET_SELECTED_NOTE action', 
        'Use SELECT_NOTE action instead'
      );
      return {
        ...state,
        selectedNoteId: action.payload,
      };

    default:
      return state;
  }
};
