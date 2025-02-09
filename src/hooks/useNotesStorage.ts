
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Note } from '@/types/notes';
import { STORAGE_KEY, sanitizeContent } from '@/utils/noteUtils';

export const useNotesStorage = () => {
  const saveNotes = useCallback((notes: Note[]) => {
    const sanitizedNotes = notes.map(note => ({
      ...note,
      content: sanitizeContent(note.content)
    }));
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedNotes));
      window.dispatchEvent(new Event('notesUpdated'));
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes. Please try again.');
    }
  }, []);

  return { saveNotes };
};
