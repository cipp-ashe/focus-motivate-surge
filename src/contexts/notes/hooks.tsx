
import { useCallback, useContext } from 'react';
import { NoteContext } from './NoteContext';
import type { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { deprecate } from '@/utils/deprecation';

export const useNoteActions = () => {
  const { dispatch } = useContext(NoteContext);

  const loadNotes = useCallback(() => {
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
  }, [dispatch]);

  const addNote = useCallback((note: Omit<Note, 'id'> & { id?: string }) => {
    const newNote: Note = {
      id: note.id || `note-${Date.now()}`,
      ...note,
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: note.updatedAt || new Date().toISOString(),
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    // Emit event with appropriate structure
    eventManager.emit('note:add', { note: newNote });
    toast.success('Note added successfully');
    
    return newNote.id;
  }, [dispatch]);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    eventManager.emit('note:delete', { id });
    toast.success('Note deleted successfully');
  }, [dispatch]);

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      dispatch({ 
        type: 'UPDATE_NOTE', 
        payload: { 
          id, 
          updates 
        }
      });
      eventManager.emit('note:update', { id, updates });
      toast.success('Note updated successfully');
    },
    [dispatch]
  );

  const selectNote = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
  }, [dispatch]);

  // Create deprecated function for backward compatibility
  const setSelectedNote = useCallback((id: string | null) => {
    deprecate(
      'useNoteActions', 
      'setSelectedNote', 
      'Use selectNote() instead of setSelectedNote()'
    );
    dispatch({ type: 'SELECT_NOTE', payload: id });
  }, [dispatch]);

  return {
    loadNotes,
    addNote,
    deleteNote,
    updateNote,
    selectNote,
    // Include deprecated function but preserve public API
    setSelectedNote,
  };
};

export const useNoteState = () => {
  const { state } = useContext(NoteContext);
  return {
    notes: state.notes,
    selectedNoteId: state.selectedNoteId,
  };
};
