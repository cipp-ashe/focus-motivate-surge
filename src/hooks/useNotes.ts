import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Note, Tag, TagColor, isValidTagColor } from '@/types/notes';

export type { Note, Tag, TagColor };
export { isValidTagColor };

export const STORAGE_KEY = 'notes';

export const useNotes = () => {
  console.log('useNotes hook initialized');
  
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      console.log('Initializing notes from localStorage');
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      console.log('Raw notes from localStorage:', savedNotes ? `${savedNotes.substring(0, 50)}...` : 'null');
      
      if (!savedNotes) {
        console.log('No notes found in localStorage, initializing with empty array');
        return [];
      }
      
      const parsedNotes = JSON.parse(savedNotes);
      if (!Array.isArray(parsedNotes)) {
        console.error('Notes in localStorage is not an array:', typeof parsedNotes);
        return [];
      }
      
      console.log(`Loaded ${parsedNotes.length} notes from localStorage`);
      return parsedNotes;
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      return [];
    }
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    console.log('Setting up storage event listeners');
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          console.log('Storage event detected for notes');
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
        console.log('Notes updated event received');
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
      console.log('Removing storage event listeners');
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notesUpdated', handleNotesUpdated);
    };
  }, []);

  const saveNote = useCallback((note: Note) => {
    try {
      console.log('Saving note:', note.id);
      
      if (!Array.isArray(notes)) {
        console.error('Notes state is not an array:', notes);
        setNotes([]);
        return false;
      }
      
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
      
      if (!Array.isArray(notes)) {
        console.error('Notes state is not an array during delete operation:', notes);
        return false;
      }
      
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
      toast.error('Cannot add empty note');
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
    
    if (saveNote(newNote)) {
      setCurrentContent('');
      toast.success('Note added ✨');
      return newNote;
    }
    
    return null;
  }, [currentContent, saveNote]);

  const updateNote = useCallback((noteId: string, content: string) => {
    console.log('Updating note:', noteId);
    
    if (!Array.isArray(notes)) {
      console.error('Notes state is not an array during update operation:', notes);
      return false;
    }
    
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
    
    return saveNote(updatedNote);
  }, [notes, saveNote]);

  const addTagToNote = useCallback((noteId: string, tagName: string, colorName: string = 'default') => {
    console.log('Adding tag to note:', noteId, tagName, colorName);
    
    if (!Array.isArray(notes)) {
      console.error('Notes state is not an array during add tag operation:', notes);
      return false;
    }
    
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
    
    if (!Array.isArray(notes)) {
      console.error('Notes state is not an array during remove tag operation:', notes);
      return false;
    }
    
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
