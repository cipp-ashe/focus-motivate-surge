
import { Note } from '@/types/notes';
import { toast } from 'sonner';
import { sanitizeContent } from '@/utils/noteUtils';

export const NOTES_STORAGE_KEY = 'notes';

/**
 * Centralized service for note storage operations
 */
export const noteStorage = {
  /**
   * Save notes to localStorage with sanitization
   */
  saveNotes: (notes: Note[]): boolean => {
    try {
      const sanitizedNotes = notes.map(note => ({
        ...note,
        content: sanitizeContent(note.content)
      }));
      
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sanitizedNotes));
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes. Please try again.');
      return false;
    }
  },
  
  /**
   * Load notes from localStorage
   */
  loadNotes: (): Note[] => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!savedNotes) return [];
      
      return JSON.parse(savedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes. Using empty list.');
      return [];
    }
  },
  
  /**
   * Clear all notes
   */
  clearNotes: (): boolean => {
    try {
      localStorage.removeItem(NOTES_STORAGE_KEY);
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
    } catch (error) {
      console.error('Error clearing notes:', error);
      return false;
    }
  },
  
  /**
   * Delete a specific note by ID
   */
  deleteNote: (noteId: string): boolean => {
    try {
      const notes = noteStorage.loadNotes();
      const updatedNotes = notes.filter(note => note.id !== noteId);
      return noteStorage.saveNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  },
  
  /**
   * Add a tag to a note
   */
  addTagToNote: (noteId: string, tagName: string, color: string = 'default'): boolean => {
    if (!tagName.trim()) return false;
    
    try {
      const notes = noteStorage.loadNotes();
      const updatedNotes = notes.map(note => {
        if (note.id === noteId) {
          const newTag = { name: tagName.trim(), color };
          return { 
            ...note, 
            tags: [...note.tags.filter(t => t.name !== newTag.name), newTag]
          };
        }
        return note;
      });
      
      return noteStorage.saveNotes(updatedNotes);
    } catch (error) {
      console.error('Error adding tag to note:', error);
      return false;
    }
  },
  
  /**
   * Remove a tag from a note
   */
  removeTagFromNote: (noteId: string, tagName: string): boolean => {
    try {
      const notes = noteStorage.loadNotes();
      const updatedNotes = notes.map(note => {
        if (note.id === noteId) {
          return { ...note, tags: note.tags.filter(t => t.name !== tagName) };
        }
        return note;
      });
      
      return noteStorage.saveNotes(updatedNotes);
    } catch (error) {
      console.error('Error removing tag from note:', error);
      return false;
    }
  }
};
