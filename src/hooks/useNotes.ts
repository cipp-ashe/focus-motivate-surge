
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Note, Tag, TagColor, isValidTagColor } from '@/types/notes';

export type { Note, Tag, TagColor };
export { isValidTagColor };

export const STORAGE_KEY = 'notes';

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

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentContent, setCurrentContent] = useState('');

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

  const updateCurrentContent = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);

  const selectNoteForEdit = useCallback((note: Note) => {
    setSelectedNote(note);
    setCurrentContent(note.content);
  }, []);

  const clearSelectedNote = useCallback(() => {
    setSelectedNote(null);
    setCurrentContent('');
  }, []);

  const addNote = useCallback(() => {
    if (!currentContent.trim()) return null;
    
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: currentContent.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };
    
    saveNote(newNote);
    setCurrentContent('');
    return newNote;
  }, [currentContent, saveNote]);

  const updateNote = useCallback((noteId: string, content: string) => {
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (!noteToUpdate) return false;
    
    const updatedNote = {
      ...noteToUpdate,
      content,
      updatedAt: new Date().toISOString()
    };
    
    return saveNote(updatedNote);
  }, [notes, saveNote]);

  const addTagToNote = useCallback((noteId: string, tagName: string, colorName: string = 'default') => {
    const color = isValidTagColor(colorName) ? colorName as TagColor : 'default';
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (!noteToUpdate) return false;
    
    const newTag: Tag = { name: tagName.trim(), color };
    const existingTagIndex = noteToUpdate.tags.findIndex(t => t.name === tagName);
    
    let updatedTags;
    if (existingTagIndex >= 0) {
      updatedTags = [...noteToUpdate.tags];
      updatedTags[existingTagIndex] = newTag;
    } else {
      updatedTags = [...noteToUpdate.tags, newTag];
    }
    
    const updatedNote = {
      ...noteToUpdate,
      tags: updatedTags,
      updatedAt: new Date().toISOString()
    };
    
    return saveNote(updatedNote);
  }, [notes, saveNote]);

  const removeTagFromNote = useCallback((noteId: string, tagName: string) => {
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (!noteToUpdate) return false;
    
    const updatedNote = {
      ...noteToUpdate,
      tags: noteToUpdate.tags.filter(t => t.name !== tagName),
      updatedAt: new Date().toISOString()
    };
    
    return saveNote(updatedNote);
  }, [notes, saveNote]);

  return { 
    notes, 
    saveNote, 
    deleteNote,
    selectedNote,
    currentContent,
    updateCurrentContent,
    selectNoteForEdit,
    clearSelectedNote,
    addNote,
    updateNote,
    addTagToNote,
    removeTagFromNote
  };
};
