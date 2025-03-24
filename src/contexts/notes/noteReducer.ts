
import { NoteState, Note } from './initialState';

// Define the action types
type ActionType = 
  | { type: 'LOADING' }
  | { type: 'ERROR', payload: Error }
  | { type: 'SET_NOTES', payload: Note[] }
  | { type: 'ADD_NOTE', payload: Note }
  | { type: 'UPDATE_NOTE', payload: { id: string, updates: Partial<Note> } }
  | { type: 'DELETE_NOTE', payload: string }
  | { type: 'SELECT_NOTE', payload: string | null };

// The reducer function
export const noteReducer = (state: NoteState, action: ActionType): NoteState => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload],
        isLoading: false,
        error: null
      };
    
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id 
            ? { ...note, ...action.payload.updates }
            : note
        ),
        isLoading: false,
        error: null
      };
    
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
        selectedNoteId: state.selectedNoteId === action.payload ? null : state.selectedNoteId,
        isLoading: false,
        error: null
      };
    
    case 'SELECT_NOTE':
      return {
        ...state,
        selectedNoteId: action.payload,
        error: null
      };
    
    default:
      return state;
  }
};
