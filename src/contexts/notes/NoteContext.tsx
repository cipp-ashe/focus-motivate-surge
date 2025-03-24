import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';

// Define the state type
interface NoteState {
  notes: Note[];
  selectedNoteId: string | null;
}

// Define the action types
type NoteAction =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: { id: string; title: string } }
  | { type: 'SELECT_NOTE'; payload: string }
  | { type: 'CLEAR_NOTES' };

// Define the reducer function
const noteReducer = (state: NoteState, action: NoteAction): NoteState => {
  switch (action.type) {
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? { ...note, ...action.payload.updates } : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload.id),
        selectedNoteId: state.selectedNoteId === action.payload.id ? null : state.selectedNoteId,
      };
    case 'SELECT_NOTE':
      return { ...state, selectedNoteId: action.payload };
    case 'CLEAR_NOTES':
      return { ...state, notes: [], selectedNoteId: null };
    default:
      return state;
  }
};

// Define the initial state
const initialState: NoteState = {
  notes: [],
  selectedNoteId: null,
};

// Create the context
interface NoteContextProps {
  state: NoteState;
  dispatch: Dispatch<NoteAction>;
}

const NoteContext = createContext<NoteContextProps | undefined>(undefined);

// Create a provider component
interface NoteProviderProps {
  children: React.ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  // Load notes from localStorage on initialization
  React.useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes) as Note[];
        parsedNotes.forEach(note => {
          dispatch({ type: 'ADD_NOTE', payload: note });
        });
      }
    } catch (error) {
      console.error('Failed to load notes from localStorage', error);
      toast.error('Failed to load notes');
    }
  }, [dispatch]);

  // Save notes to localStorage whenever the notes change
  React.useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(state.notes));
    } catch (error) {
      console.error('Failed to save notes to localStorage', error);
      toast.error('Failed to save notes');
    }
  }, [state.notes]);

  return (
    <NoteContext.Provider value={{ state, dispatch }}>
      {children}
    </NoteContext.Provider>
  );
};

// Create custom hooks to use the context
export const useNoteState = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteState must be used within a NoteProvider');
  }
  return context.state;
};

export const useNoteDispatch = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteDispatch must be used within a NoteProvider');
  }
  return context.dispatch;
};

// Define action functions
export const addNote = (dispatch: Dispatch<NoteAction>) => (note: Omit<Note, 'id'>) => {
  const id = uuidv4();
  const newNote: Note = { id, ...note };
  dispatch({ type: 'ADD_NOTE', payload: newNote });
  toast.success('Note added successfully');
  eventManager.emit('note:add', { ...newNote, content: newNote.content || '' });
};

export const updateNote = (dispatch: Dispatch<NoteAction>) => (id: string, updates: Partial<Note>) => {
  dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } });
  toast.success('Note updated successfully');
  eventManager.emit('note:update', { id, updates });
};

export const deleteNote = (dispatch: Dispatch<NoteAction>) => (id: string) => {
  if (!id) return;
  
  dispatch({ 
    type: 'DELETE_NOTE', 
    payload: { id, title: "" } 
  });
  
  toast.success('Note deleted successfully');
  eventManager.emit('note:delete', { id });
};

export const selectNote = (dispatch: Dispatch<NoteAction>) => (id: string) => {
  dispatch({ type: 'SELECT_NOTE', payload: id });
};

export const clearNotes = (dispatch: Dispatch<NoteAction>) => () => {
  dispatch({ type: 'CLEAR_NOTES' });
  toast.success('All notes cleared successfully');
  eventManager.emit('notes:clear', {});
};
