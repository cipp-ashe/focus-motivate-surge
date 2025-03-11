
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Note, Tag, TagColor, isValidTagColor } from '@/types/notes';

export type { Note, Tag, TagColor };
export { isValidTagColor };

export const STORAGE_KEY = 'notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      console.log('Initializing notes from localStorage');
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];
      console.log(`Loaded ${parsedNotes.length} notes from localStorage`);
      return parsedNotes;
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
          console.log(`Storage event: updated to ${updatedNotes.length} notes`);
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
        console.log(`Notes updated event: now ${updatedNotes.length} notes`);
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
      console.log('Saving note:', note.id);
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
      console.log('Deleting note:', noteId);
      const updatedNotes = notes.filter(note => note.id !== noteId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      
      // If the deleted note was selected, clear the selection
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null);
        setCurrentContent('');
      }
      
      window.dispatchEvent(new Event('notesUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  }, [notes, selectedNote]);

  const updateCurrentContent = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);

  const selectNoteForEdit = useCallback((note: Note) => {
    console.log('Selecting note for edit:', note.id);
    setSelectedNote(note);
    setCurrentContent(note.content);
  }, []);

  const clearSelectedNote = useCallback(() => {
    setSelectedNote(null);
    setCurrentContent('');
  }, []);

  const addNote = useCallback(() => {
    if (!currentContent.trim()) {
      console.log('Cannot add empty note');
      return null;
    }
    
    console.log('Adding new note');
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
    toast.success('Note added ✨');
    return newNote;
  }, [currentContent, saveNote]);

  const updateNote = useCallback((noteId: string, content: string) => {
    console.log('Updating note:', noteId);
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (!noteToUpdate) {
      console.error('Note not found for update:', noteId);
      return false;
    }
    
    const updatedNote = {
      ...noteToUpdate,
      content,
      updatedAt: new Date().toISOString()
    };
    
    const success = saveNote(updatedNote);
    if (success) {
      toast.success('Note updated ✨');
      clearSelectedNote();
    }
    return success;
  }, [notes, saveNote, clearSelectedNote]);

  const addTagToNote = useCallback((noteId: string, tagName: string, colorName: string = 'default') => {
    console.log('Adding tag to note:', noteId, tagName, colorName);
    const color = isValidTagColor(colorName) ? colorName as TagColor : 'default';
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (!noteToUpdate) {
      console.error('Note not found for adding tag:', noteId);
      return false;
    }
    
    // Ensure tags array exists
    const existingTags = noteToUpdate.tags || [];
    const newTag: Tag = { name: tagName.trim(), color };
    const existingTagIndex = existingTags.findIndex(t => t.name === tagName);
    
    let updatedTags;
    if (existingTagIndex >= 0) {
      updatedTags = [...existingTags];
      updatedTags[existingTagIndex] = newTag;
    } else {
      updatedTags = [...existingTags, newTag];
    }
    
    const updatedNote = {
      ...noteToUpdate,
      tags: updatedTags,
      updatedAt: new Date().toISOString()
    };
    
    return saveNote(updatedNote);
  }, [notes, saveNote]);

  const removeTagFromNote = useCallback((noteId: string, tagName: string) => {
    console.log('Removing tag from note:', noteId, tagName);
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (!noteToUpdate || !noteToUpdate.tags) {
      console.error('Note not found or has no tags:', noteId);
      return false;
    }
    
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
