
import React, { createContext, useReducer, useEffect } from 'react';
import { noteReducer } from './noteReducer';
import { initialState } from './initialState';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import type { Note } from '@/types/notes';
import { useNoteActions, useNoteState } from './hooks';

// Define context type
interface NoteContextType {
  state: {
    notes: Note[];
    selectedNoteId: string | null;
  };
  dispatch: React.Dispatch<any>;
}

// Create context with default value
export const NoteContext = createContext<NoteContextType>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  // Load notes from localStorage on initial render
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        dispatch({ type: 'SET_NOTES', payload: parsedNotes });
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      toast.error('Failed to load saved notes');
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(state.notes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
      toast.error('Failed to save notes');
    }
  }, [state.notes]);

  // Set up event handlers
  useEffect(() => {
    const handleAddNote = (data: { note: Note }) => {
      // Avoid duplicates
      if (!state.notes.some(note => note.id === data.note.id)) {
        dispatch({ type: 'ADD_NOTE', payload: data.note });
        toast.success('Note added');
      }
    };

    const handleUpdateNote = (data: { id: string; updates: Partial<Note> }) => {
      dispatch({ 
        type: 'UPDATE_NOTE', 
        payload: { id: data.id, updates: data.updates } 
      });
      toast.success('Note updated');
    };

    const handleDeleteNote = (data: { id: string }) => {
      dispatch({ type: 'DELETE_NOTE', payload: data.id });
      toast.success('Note deleted');
    };

    const handleSelectNote = (data: { id: string | null }) => {
      dispatch({ type: 'SELECT_NOTE', payload: data.id });
    };

    // Subscribe to events
    const unsubscribeAdd = eventManager.on('note:add', handleAddNote);
    const unsubscribeUpdate = eventManager.on('note:update', handleUpdateNote);
    const unsubscribeDelete = eventManager.on('note:delete', handleDeleteNote);
    const unsubscribeSelect = eventManager.on('note:select', handleSelectNote);

    return () => {
      // Clean up event listeners
      unsubscribeAdd();
      unsubscribeUpdate();
      unsubscribeDelete();
      unsubscribeSelect();
    };
  }, [state.notes]);

  return (
    <NoteContext.Provider value={{ state, dispatch }}>
      {children}
    </NoteContext.Provider>
  );
};

// Re-export the hooks for easier imports
export { useNoteActions, useNoteState };
