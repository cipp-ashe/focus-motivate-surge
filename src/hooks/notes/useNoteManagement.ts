
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { STORAGE_KEY, sanitizeContent } from '@/utils/noteUtils';

/**
 * Unified hook for note management
 */
export const useNoteManagement = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  });

  // Update storage and dispatch events when notes change
  useEffect(() => {
    try {
      const sanitizedNotes = notes.map(note => ({
        ...note,
        content: sanitizeContent(note.content)
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedNotes));
      window.dispatchEvent(new Event('notesUpdated'));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }, [notes]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          const updatedNotes = e.newValue ? JSON.parse(e.newValue) : [];
          setNotes(updatedNotes);
        } catch (error) {
          console.error('Error parsing notes from storage event:', error);
        }
      }
    };

    const handleNotesUpdated = () => {
      try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        if (savedNotes) {
          const updatedNotes = JSON.parse(savedNotes);
          setNotes(updatedNotes);
        }
      } catch (error) {
        console.error('Error parsing notes from custom event:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notesUpdated', handleNotesUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notesUpdated', handleNotesUpdated);
    };
  }, []);

  // Create or update a note
  const saveNote = useCallback((note: Note) => {
    try {
      setNotes(prevNotes => {
        const existingIndex = prevNotes.findIndex(n => n.id === note.id);
        
        if (existingIndex >= 0) {
          // Update existing note
          const updatedNotes = [...prevNotes];
          updatedNotes[existingIndex] = note;
          
          // Emit note update event
          eventManager.emit('note:update', { id: note.id, updates: note });
          
          return updatedNotes;
        } else {
          // Add new note
          const newNotes = [note, ...prevNotes];
          
          // Emit note create event
          eventManager.emit('note:create', { id: note.id, title: note.title, content: note.content });
          
          return newNotes;
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
      return false;
    }
  }, []);

  // Delete a note
  const deleteNote = useCallback((noteId: string) => {
    try {
      setNotes(prevNotes => {
        const updatedNotes = prevNotes.filter(note => note.id !== noteId);
        
        // Emit note delete event
        eventManager.emit('note:delete', { id: noteId });
        
        return updatedNotes;
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  }, []);

  // Select a note for viewing/editing
  const selectNote = useCallback((noteId: string) => {
    const note = notes.find(note => note.id === noteId);
    if (note) {
      eventManager.emit('note:select', { id: noteId });
      return note;
    }
    return null;
  }, [notes]);

  return {
    notes,
    saveNote,
    deleteNote,
    selectNote
  };
};
