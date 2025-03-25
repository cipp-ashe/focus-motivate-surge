
import { Note, NoteTag, TagColor } from '@/types/notes';
import { STORAGE_KEY, sanitizeContent } from '@/utils/noteUtils';

/**
 * Note storage utility functions
 */
export const noteStorage = {
  /**
   * Load notes from localStorage
   */
  loadNotes: (): Note[] => {
    try {
      const notesJson = localStorage.getItem(STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },
  
  /**
   * Save notes to localStorage
   */
  saveNotes: (notes: Note[]): boolean => {
    try {
      const sanitizedNotes = notes.map(note => ({
        ...note,
        content: sanitizeContent(note.content)
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedNotes));
      
      // Dispatch an event so other components know notes have been updated
      window.dispatchEvent(new Event('notesUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error saving notes:', error);
      return false;
    }
  },
  
  /**
   * Get a note by ID
   */
  getNoteById: (id: string): Note | undefined => {
    const notes = noteStorage.loadNotes();
    return notes.find(note => note.id === id);
  },
  
  /**
   * Save a single note
   */
  saveNote: (note: Note): boolean => {
    const notes = noteStorage.loadNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = {
        ...note,
        updatedAt: new Date().toISOString()
      };
    } else {
      notes.unshift(note);
    }
    
    return noteStorage.saveNotes(notes);
  },
  
  /**
   * Delete a note by ID
   */
  deleteNote: (id: string): boolean => {
    const notes = noteStorage.loadNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) {
      return false; // No note was deleted
    }
    
    return noteStorage.saveNotes(filteredNotes);
  },
  
  /**
   * Add a tag to a note
   */
  addTagToNote: (noteId: string, tag: NoteTag): boolean => {
    const notes = noteStorage.loadNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) return false;
    
    const note = notes[noteIndex];
    const existingTagIndex = note.tags.findIndex(t => t.id === tag.id);
    
    if (existingTagIndex >= 0) {
      // Update existing tag
      note.tags[existingTagIndex] = tag;
    } else {
      // Add new tag
      note.tags.push(tag);
    }
    
    notes[noteIndex] = {
      ...note,
      updatedAt: new Date().toISOString()
    };
    
    return noteStorage.saveNotes(notes);
  },
  
  /**
   * Remove a tag from a note
   */
  removeTagFromNote: (noteId: string, tagId: string): boolean => {
    const notes = noteStorage.loadNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) return false;
    
    const note = notes[noteIndex];
    const filteredTags = note.tags.filter(tag => tag.id !== tagId);
    
    if (filteredTags.length === note.tags.length) {
      return false; // No tag was removed
    }
    
    notes[noteIndex] = {
      ...note,
      tags: filteredTags,
      updatedAt: new Date().toISOString()
    };
    
    return noteStorage.saveNotes(notes);
  },
  
  /**
   * Clear all notes
   */
  clearNotes: (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('notesUpdated'));
      return true;
    } catch (error) {
      console.error('Error clearing notes:', error);
      return false;
    }
  }
};
