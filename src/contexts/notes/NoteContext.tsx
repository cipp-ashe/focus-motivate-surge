
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { noteReducer } from './noteReducer';
import { initialState, Note, NoteState } from './initialState';
import { v4 as uuidv4 } from 'uuid';
import { eventManager } from '@/lib/events/EventManager';

// Define the context type
interface NoteContextType extends NoteState {
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  getNoteById: (id: string) => Note | null;
}

// Create the context
const NoteContext = createContext<NoteContextType | null>(null);

// Provider component
export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: uuidv4(),
      ...note,
      createdAt: now,
      updatedAt: now
    };
    
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    eventManager.emit('note:create', newNote);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    dispatch({ 
      type: 'UPDATE_NOTE', 
      payload: { 
        id, 
        updates: { 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } 
      } 
    });
    eventManager.emit('note:update', { id, updates });
  }, []);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    eventManager.emit('note:delete', { id });
  }, []);

  const selectNote = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
    if (id) {
      const note = state.notes.find(n => n.id === id);
      if (note) {
        eventManager.emit('note:select', { id, title: note.title });
      }
    }
  }, [state.notes]);

  const getNoteById = useCallback((id: string) => {
    return state.notes.find(note => note.id === id) || null;
  }, [state.notes]);

  // Sample data for testing
  React.useEffect(() => {
    // Load any saved notes or populate with sample data
    const savedNotes = localStorage.getItem('notes');
    
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        dispatch({ type: 'SET_NOTES', payload: parsed });
      } catch (e) {
        console.error('Error loading saved notes', e);
      }
    } else {
      // Add sample note if none exist
      const sampleNote: Note = {
        id: uuidv4(),
        title: 'Welcome to Notes',
        content: 'This is a sample note to help you get started. You can edit or delete it.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['sample']
      };
      
      dispatch({ type: 'SET_NOTES', payload: [sampleNote] });
    }
  }, []);

  // Save notes to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes));
  }, [state.notes]);

  return (
    <NoteContext.Provider value={{
      ...state,
      addNote,
      updateNote,
      deleteNote,
      selectNote,
      getNoteById
    }}>
      {children}
    </NoteContext.Provider>
  );
};

// Custom hooks to use the context
export const useNoteContext = (): NoteContextType => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};

// Split into separate hooks for actions and state
export const useNoteActions = () => {
  const { addNote, updateNote, deleteNote, selectNote } = useNoteContext();
  return { addNote, updateNote, deleteNote, selectNote };
};

export const useNoteState = () => {
  const { notes, selectedNoteId, isLoading, error, getNoteById } = useNoteContext();
  return { notes, selectedNoteId, isLoading, error, getNoteById };
};
