import { useCallback, createContext, useContext, useReducer, ReactNode } from 'react';
import { Note, Tag, TagColor, isValidTagColor } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';

interface NoteState {
  notes: Note[];
  selected: Note | null;
  content: string;
  items: Note[];
}

type NoteAction = 
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: Note | null }
  | { type: 'UPDATE_CURRENT_CONTENT'; payload: string };

const initialState: NoteState = {
  notes: [],
  selected: null,
  content: '',
  items: []
};

const NoteStateContext = createContext<NoteState | undefined>(undefined);
const NoteDispatchContext = createContext<React.Dispatch<NoteAction> | undefined>(undefined);

function noteReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case 'ADD_NOTE': {
      const newNotes = [action.payload, ...state.notes];
      return { 
        ...state, 
        notes: newNotes,
        items: newNotes
      };
    }
    case 'UPDATE_NOTE': {
      const updatedNotes = state.notes.map(note => 
        note.id === action.payload.id 
          ? { ...note, ...action.payload.updates } 
          : note
      );
      return {
        ...state,
        notes: updatedNotes,
        items: updatedNotes
      };
    }
    case 'DELETE_NOTE': {
      const filteredNotes = state.notes.filter(note => note.id !== action.payload);
      return {
        ...state,
        notes: filteredNotes,
        items: filteredNotes
      };
    }
    case 'SELECT_NOTE':
      return { ...state, selected: action.payload };
    case 'UPDATE_CURRENT_CONTENT':
      return { ...state, content: action.payload };
    default:
      return state;
  }
}

export function NoteContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  const stateWithItems: NoteState = {
    ...state,
    items: state.notes
  };

  return (
    <NoteStateContext.Provider value={stateWithItems}>
      <NoteDispatchContext.Provider value={dispatch}>
        {children}
      </NoteDispatchContext.Provider>
    </NoteStateContext.Provider>
  );
}

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
    
    eventManager.emit('note:view', { 
      id: note.id,
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
    
    eventManager.emit('note:update', { 
      id, 
      noteId: id,
      updates: updatedNote
    });
  }, [dispatch]);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    if (selected?.id === id) {
      dispatch({ type: 'SELECT_NOTE', payload: null });
      dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
    }
    
    eventManager.emit('note:deleted', { 
      id 
    });
  }, [dispatch, selected?.id]);

  const addTagToNote = useCallback((noteId: string, tagName: string, tagColor: string = 'default') => {
    const color: TagColor = isValidTagColor(tagColor) ? tagColor as TagColor : 'default';
    
    const updates: Partial<Note> = {
      updatedAt: new Date().toISOString()
    };
    
    const currentNote = useNoteState().notes.find(note => note.id === noteId);
    if (currentNote) {
      const tags = [...(currentNote.tags || [])];
      const existingTagIndex = tags.findIndex(tag => tag.name === tagName);
      
      if (existingTagIndex >= 0) {
        tags[existingTagIndex] = { ...tags[existingTagIndex], color };
      } else {
        tags.push({ name: tagName, color });
      }
      
      updates.tags = tags;
    }
    
    dispatch({ 
      type: 'UPDATE_NOTE',
      payload: { id: noteId, updates }
    });
  }, []);

  const removeTagFromNote = useCallback((noteId: string, tagId: string) => {
    const currentNote = useNoteState().notes.find(note => note.id === noteId);
    if (currentNote && currentNote.tags) {
      const updates: Partial<Note> = {
        tags: currentNote.tags.filter(tag => tag.name !== tagId),
        updatedAt: new Date().toISOString()
      };
      
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { id: noteId, updates }
      });
    }
  }, []);

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
