
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Note } from '@/types/notes';
import { STORAGE_KEY } from '@/utils/noteUtils';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  });

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
        const updatedNotes = savedNotes ? JSON.parse(savedNotes) : [];
        setNotes(updatedNotes);
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

  const saveNote = useCallback((note: Note) => {
    try {
      const updatedNotes = [...notes];
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        updatedNotes[existingIndex] = note;
      } else {
        updatedNotes.unshift(note);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      window.dispatchEvent(new Event('notesUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
      return false;
    }
  }, [notes]);

  const deleteNote = useCallback((noteId: string) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      window.dispatchEvent(new Event('notesUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  }, [notes]);

  return { notes, saveNote, deleteNote };
};
