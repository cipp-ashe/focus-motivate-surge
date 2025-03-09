
import { Note, Tag, TagColor } from '@/types/notes';

const STORAGE_KEY = 'notes';

/**
 * Service for managing note storage
 */
export const noteStorage = {
  /**
   * Load all notes from localStorage
   */
  loadNotes: (): Note[] => {
    try {
      const notesStr = localStorage.getItem(STORAGE_KEY);
      return notesStr ? JSON.parse(notesStr) : [];
    } catch (error) {
      console.error('Error loading notes from storage:', error);
      return [];
    }
  },

  /**
   * Save all notes to localStorage
   */
  saveNotes: (notes: Note[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
    } catch (error) {
      console.error('Error saving notes to storage:', error);
      return false;
    }
  },

  /**
   * Delete a specific note
   */
  deleteNote: (noteId: string): boolean => {
    try {
      const notes = noteStorage.loadNotes();
      const updatedNotes = notes.filter(note => note.id !== noteId);
      
      if (notes.length === updatedNotes.length) {
        // Note was not found
        return false;
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  },

  /**
   * Add a tag to a note
   */
  addTagToNote: (noteId: string, tagName: string, color: TagColor = 'default'): boolean => {
    try {
      const notes = noteStorage.loadNotes();
      const noteIndex = notes.findIndex(note => note.id === noteId);
      
      if (noteIndex === -1) {
        return false;
      }
      
      const note = notes[noteIndex];
      
      // Check if tag already exists
      const existingTagIndex = note.tags.findIndex(tag => tag.name === tagName);
      
      if (existingTagIndex >= 0) {
        // Update existing tag color
        note.tags[existingTagIndex].color = color;
      } else {
        // Add new tag
        note.tags.push({ name: tagName, color });
      }
      
      // Update note
      notes[noteIndex] = {
        ...note,
        updatedAt: new Date().toISOString()
      };
      
      // Save updated notes
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
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
      const noteIndex = notes.findIndex(note => note.id === noteId);
      
      if (noteIndex === -1) {
        return false;
      }
      
      const note = notes[noteIndex];
      
      // Remove tag
      note.tags = note.tags.filter(tag => tag.name !== tagName);
      
      // Update note
      notes[noteIndex] = {
        ...note,
        updatedAt: new Date().toISOString()
      };
      
      // Save updated notes
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
    } catch (error) {
      console.error('Error removing tag from note:', error);
      return false;
    }
  },

  /**
   * Clear all notes
   */
  clearNotes: (): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
    } catch (error) {
      console.error('Error clearing notes:', error);
      return false;
    }
  }
};
