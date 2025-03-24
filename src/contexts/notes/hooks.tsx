import { useCallback, useContext } from 'react';
import { useNoteState, useNoteActions } from './NoteContext';
import type { Note, Relationship, Tag } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { deprecate } from '@/utils/deprecation';

// Re-export the hooks from NoteContext for backward compatibility
export { useNoteState, useNoteActions };

// Combined hook for convenience
export const useNotes = () => {
  return {
    ...useNoteState(),
    ...useNoteActions(),
  };
};

// Legacy hooks for backward compatibility
export const useNoteActionsLegacy = () => {
  const { addNote, deleteNote, updateNote, selectNote } = useNoteActions();

  const loadNotes = useCallback(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        // Use the new actions
        parsedNotes.forEach((note: Note) => {
          addNote(note);
        });
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      toast.error('Failed to load saved notes');
    }
  }, [addNote]);

  // Function to add a relationship to a note
  const addRelationship = useCallback(
    (noteId: string, entityId: string, entityType: string, metadata?: Record<string, any>) => {
      const relationship: Relationship = {
        entityId,
        entityType: entityType as any,
        metadata,
      };

      // Get current note
      const note = document.querySelector(`[data-note-id="${noteId}"]`);
      const relationships = note?.getAttribute('data-relationships')
        ? JSON.parse(note.getAttribute('data-relationships') || '[]')
        : [];

      updateNote(noteId, {
        relationships: [...relationships, relationship],
      });
    },
    [updateNote]
  );

  // Create deprecated function for backward compatibility
  const setSelectedNote = useCallback(
    (id: string | null) => {
      deprecate(
        'useNoteActions',
        'setSelectedNote',
        'Use selectNote() instead of setSelectedNote()'
      );
      selectNote(id);
    },
    [selectNote]
  );

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

export const useNoteStateLegacy = () => {
  const { notes, selectedNoteId } = useNoteState();
  return {
    notes,
    selectedNoteId,
  };
};
