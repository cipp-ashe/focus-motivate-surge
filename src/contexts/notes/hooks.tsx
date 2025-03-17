
import { useCallback, createContext, useContext, useReducer, ReactNode } from 'react';
import { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { NoteEventType } from '@/lib/events/types';

// Define the state type
interface NoteState {
  notes: Note[];
  selected: Note | null;
  content: string;
}

// Define the action types
type NoteAction = 
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: Note | null }
  | { type: 'UPDATE_CURRENT_CONTENT'; payload: string }
  | { type: 'ADD_TAG_TO_NOTE'; payload: { noteId: string; tagName: string; tagColor?: string } }
  | { type: 'REMOVE_TAG_FROM_NOTE'; payload: { noteId: string; tagId: string } };

// Initialize the state
const initialState: NoteState = {
  notes: [],
  selected: null,
  content: ''
};

// Create the context
const NoteStateContext = createContext<NoteState | undefined>(undefined);
const NoteDispatchContext = createContext<React.Dispatch<NoteAction> | undefined>(undefined);

// Create the reducer
function noteReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id 
            ? { ...note, ...action.payload.updates } 
            : note
        )
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    case 'SELECT_NOTE':
      return { ...state, selected: action.payload };
    case 'UPDATE_CURRENT_CONTENT':
      return { ...state, content: action.payload };
    case 'ADD_TAG_TO_NOTE': {
      const { noteId, tagName, tagColor = 'default' } = action.payload;
      return {
        ...state,
        notes: state.notes.map(note => {
          if (note.id === noteId) {
            const tags = note.tags || [];
            // Check if tag already exists
            const tagExists = tags.some(tag => tag.name === tagName);
            if (!tagExists) {
              return {
                ...note,
                tags: [...tags, { name: tagName, color: tagColor }]
              };
            }
          }
          return note;
        })
      };
    }
    case 'REMOVE_TAG_FROM_NOTE': {
      const { noteId, tagId } = action.payload;
      return {
        ...state,
        notes: state.notes.map(note => {
          if (note.id === noteId && note.tags) {
            return {
              ...note,
              tags: note.tags.filter(tag => tag.name !== tagId)
            };
          }
          return note;
        })
      };
    }
    default:
      return state;
  }
}

// Create the provider component
export function NoteContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  return (
    <NoteStateContext.Provider value={state}>
      <NoteDispatchContext.Provider value={dispatch}>
        {children}
      </NoteDispatchContext.Provider>
    </NoteStateContext.Provider>
  );
}

// Create the hooks
export function useNoteState() {
  const context = useContext(NoteStateContext);
  if (context === undefined) {
    throw new Error('useNoteState must be used within a NoteContextProvider');
  }
  return context;
}

export function useNoteDispatch() {
  const context = useContext(NoteDispatchContext);
  if (context === undefined) {
    throw new Error('useNoteDispatch must be used within a NoteContextProvider');
  }
  return context;
}

export const useNoteActions = () => {
  const dispatch = useNoteDispatch();
  const { selected, content } = useNoteState();

  const updateCurrentContent = useCallback((content: string) => {
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: content });
  }, [dispatch]);

  const selectNoteForEdit = useCallback((note: Note) => {
    dispatch({ type: 'SELECT_NOTE', payload: note });
    
    // Also emit an event for other parts of the app
    eventManager.emit('note:view', { 
      id: note.id,
      title: note.title || 'Untitled Note'
    });
  }, [dispatch]);

  const addNote = useCallback(() => {
    if (!content?.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: content.split('\n')[0]?.trim().replace(/^#+ /, '') || 'Untitled Note',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    dispatch({ type: 'SELECT_NOTE', payload: null });
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
    
    // Emit event for other components
    eventManager.emit('note:create', { 
      id: newNote.id, 
      title: newNote.title, 
      content: newNote.content 
    });
  }, [content, dispatch]);

  const updateNote = useCallback((id: string, newContent: string) => {
    if (!id || !newContent.trim()) return;

    const updatedNote: Partial<Note> = {
      content: newContent,
      title: newContent.split('\n')[0]?.trim().replace(/^#+ /, '') || 'Untitled Note',
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates: updatedNote } });
    dispatch({ type: 'SELECT_NOTE', payload: null });
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
    
    // Emit event for other components
    eventManager.emit('note:update', { 
      id, 
      updates: updatedNote
    });
  }, [dispatch]);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    if (selected?.id === id) {
      dispatch({ type: 'SELECT_NOTE', payload: null });
      dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
    }
    
    // Emit event for other components
    eventManager.emit('note:deleted', { 
      noteId: id 
    });
  }, [dispatch, selected?.id]);

  const addTagToNote = useCallback((noteId: string, tagName: string, tagColor?: string) => {
    dispatch({
      type: 'ADD_TAG_TO_NOTE',
      payload: { noteId, tagName, tagColor }
    });
  }, [dispatch]);

  const removeTagFromNote = useCallback((noteId: string, tagId: string) => {
    dispatch({
      type: 'REMOVE_TAG_FROM_NOTE',
      payload: { noteId, tagId }
    });
  }, [dispatch]);

  const clearCurrentNote = useCallback(() => {
    dispatch({ type: 'SELECT_NOTE', payload: null });
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
  }, [dispatch]);

  return {
    updateCurrentContent,
    selectNoteForEdit,
    addNote,
    updateNote,
    deleteNote,
    addTagToNote,
    removeTagFromNote,
    clearCurrentNote
  };
};
