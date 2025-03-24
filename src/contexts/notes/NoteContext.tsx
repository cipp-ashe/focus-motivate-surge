
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { noteReducer } from './noteReducer';
import { initialState, Note } from './initialState';
import { eventManager } from '@/lib/events/EventManager';

// Define the context type
interface NoteContextType {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
  addNote: (note?: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
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

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('notes');
      if (storedNotes) {
        dispatch({ type: 'SET_NOTES', payload: JSON.parse(storedNotes) });
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      dispatch({ type: 'ERROR', payload: error as Error });
    }
  }, []);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes));
  }, [state.notes]);

  const addNote = (note?: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: note?.title || 'Untitled Note',
      content: note?.content || '',
      createdAt: now,
      updatedAt: now,
      tags: note?.tags || []
    };
    
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    eventManager.emit('note:create', { id: newNote.id });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
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
  };

  const deleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    eventManager.emit('note:delete', { id });
  };

  const selectNote = (id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
    if (id) {
      const note = state.notes.find(n => n.id === id);
      if (note) {
        eventManager.emit('note:select', { id });
      }
    }
  };

  const getNoteById = (id: string) => {
    return state.notes.find(note => note.id === id) || null;
  };

  // Sample data for testing
  useEffect(() => {
    // Load any saved notes or populate with sample data
    if (state.notes.length === 0) {
      // Add sample note if none exist
      const sampleNote: Note = {
        id: crypto.randomUUID(),
        title: 'Welcome to Notes',
        content: 'This is a sample note to help you get started. You can edit or delete it.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['sample']
      };
      
      dispatch({ type: 'SET_NOTES', payload: [sampleNote] });
    }
  }, [state.notes.length]);

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

// Custom hook to use the context
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
