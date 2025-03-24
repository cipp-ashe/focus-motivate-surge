
import { useCallback, useContext } from 'react';
import { NoteContext } from './NoteContext';
import type { Note, Relationship, Tag } from '@/types/notes';
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
    const now = new Date().toISOString();
    const newNote: Note = {
      id: note.id || `note-${Date.now()}`,
      title: note.title || 'Untitled Note',
      content: note.content || '',
      tags: note.tags || [],
      ...note,
      createdAt: note.createdAt || now,
      updatedAt: note.updatedAt || now,
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
      // Always update the updatedAt timestamp when updating a note
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      dispatch({ 
        type: 'UPDATE_NOTE', 
        payload: { 
          id, 
          updates: updatesWithTimestamp
        }
      });
      eventManager.emit('note:update', { id, updates: updatesWithTimestamp });
      toast.success('Note updated successfully');
    },
    [dispatch]
  );

  const selectNote = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
    if (id) {
      eventManager.emit('note:select', { id });
    }
  }, [dispatch]);

  // Function to add a relationship to a note
  const addRelationship = useCallback((
    noteId: string, 
    entityId: string, 
    entityType: string, 
    metadata?: Record<string, any>
  ) => {
    const relationship: Relationship = {
      entityId,
      entityType: entityType as any,
      metadata
    };
    
    // Get current note
    const note = document.querySelector(`[data-note-id="${noteId}"]`);
    const relationships = note?.getAttribute('data-relationships') 
      ? JSON.parse(note.getAttribute('data-relationships') || '[]') 
      : [];
      
    updateNote(noteId, { 
      relationships: [...relationships, relationship]
    });
  }, [updateNote]);

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
    addRelationship,
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
