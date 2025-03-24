import { useCallback, useContext } from 'react';
import { NoteContext } from './NoteContext';
import type { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useNoteActions = () => {
  const { dispatch } = useContext(NoteContext);

  const addNote = useCallback((note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      ...note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    eventManager.emit('note:add', newNote);
    toast.success('Note added successfully');
  }, [dispatch]);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: { id, title: "" } });
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

  const setSelectedNote = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_NOTE', payload: id });
  }, [dispatch]);

  return {
    addNote,
    deleteNote,
    updateNote,
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
