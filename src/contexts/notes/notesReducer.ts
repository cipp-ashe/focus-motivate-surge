
import { Note, NoteTag } from '@/types/notes';

// Define state interface
export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
  filter: string | null;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  tags: NoteTag[];
  view: 'grid' | 'list';
  showArchived: boolean;
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
  | { type: 'SET_SORTING'; payload: { sortBy: 'createdAt' | 'updatedAt' | 'title'; direction: 'asc' | 'desc' } }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_TAGS'; payload: NoteTag[] }
  | { type: 'ADD_TAG'; payload: NoteTag }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'UPDATE_NOTE_TAGS'; payload: { noteId: string; tags: NoteTag[] } }
  | { type: 'SET_VIEW'; payload: 'grid' | 'list' }
  | { type: 'ARCHIVE_NOTE'; payload: string }
  | { type: 'UNARCHIVE_NOTE'; payload: string }
  | { type: 'PIN_NOTE'; payload: string }
  | { type: 'UNPIN_NOTE'; payload: string }
  | { type: 'SET_SHOW_ARCHIVED'; payload: boolean };

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
    
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload
      };
    
    case 'SET_TAGS':
      return {
        ...state,
        tags: action.payload
      };
    
    case 'ADD_TAG':
      return {
        ...state,
        tags: [...state.tags, action.payload]
      };
    
    case 'REMOVE_TAG': {
      // Remove tag from all notes
      const updatedNotes = state.notes.map(note => ({
        ...note,
        tags: note.tags.filter(tag => tag.id !== action.payload)
      }));
      
      return {
        ...state,
        tags: state.tags.filter(tag => tag.id !== action.payload),
        notes: updatedNotes
      };
    }
    
    case 'UPDATE_NOTE_TAGS': {
      const { noteId, tags } = action.payload;
      
      const updatedNotes = state.notes.map(note => 
        note.id === noteId ? { ...note, tags } : note
      );
      
      return {
        ...state,
        notes: updatedNotes
      };
    }
    
    case 'SET_VIEW':
      return {
        ...state,
        view: action.payload
      };
    
    case 'ARCHIVE_NOTE': {
      const updatedNotes = state.notes.map(note => 
        note.id === action.payload ? { ...note, archived: true } : note
      );
      
      return {
        ...state,
        notes: updatedNotes
      };
    }
    
    case 'UNARCHIVE_NOTE': {
      const updatedNotes = state.notes.map(note => 
        note.id === action.payload ? { ...note, archived: false } : note
      );
      
      return {
        ...state,
        notes: updatedNotes
      };
    }
    
    case 'PIN_NOTE': {
      const updatedNotes = state.notes.map(note => 
        note.id === action.payload ? { ...note, pinned: true } : note
      );
      
      return {
        ...state,
        notes: updatedNotes
      };
    }
    
    case 'UNPIN_NOTE': {
      const updatedNotes = state.notes.map(note => 
        note.id === action.payload ? { ...note, pinned: false } : note
      );
      
      return {
        ...state,
        notes: updatedNotes
      };
    }
    
    case 'SET_SHOW_ARCHIVED':
      return {
        ...state,
        showArchived: action.payload
      };
      
    default:
      return state;
  }
};
