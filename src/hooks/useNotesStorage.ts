
import { useCallback } from 'react';
import { Note, TagColor, isValidTagColor } from '@/types/notes';
import { noteStorage } from '@/lib/storage/noteStorage';
import { toast } from 'sonner';

/**
 * Hook for interacting with the note storage service
 */
export const useNotesStorage = () => {
  const saveNotes = useCallback((notes: Note[]) => {
    const success = noteStorage.saveNotes(notes);
    
    if (success) {
      // We don't need to show a success toast as it will make too many notifications
      // during normal app usage
    } else {
      toast.error('Failed to save notes');
    }
  }, []);

  const addTagToNote = useCallback((noteId: string, tagName: string, colorString: string = 'default') => {
    // Validate the color before passing it
    const color: TagColor = isValidTagColor(colorString) ? colorString as TagColor : 'default';
    
    const success = noteStorage.addTagToNote(noteId, tagName, color);
    
    if (success) {
      toast.success("Tag added ✨");
    } else {
      toast.error("Failed to add tag");
    }
  }, []);

  const removeTagFromNote = useCallback((noteId: string, tagName: string) => {
    const success = noteStorage.removeTagFromNote(noteId, tagName);
    
    if (success) {
      toast.success("Tag removed 🗑️");
    } else {
      toast.error("Failed to remove tag");
    }
  }, []);

  const clearAllNotes = useCallback(() => {
    const success = noteStorage.clearNotes();
    
    if (success) {
      toast.success("All notes cleared 🗑️");
    } else {
      toast.error("Failed to clear notes");
    }
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    const success = noteStorage.deleteNote(noteId);
    
    if (success) {
      toast.success("Note deleted 🗑️");
    } else {
      toast.error("Failed to delete note");
    }
  }, []);

  return {
    saveNotes,
    addTagToNote,
    removeTagFromNote,
    clearAllNotes,
    deleteNote
  };
};
