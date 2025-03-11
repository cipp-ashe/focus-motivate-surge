
import { useState, useEffect, useCallback } from 'react';
import { Note, Tag, TagColor } from '@/types/notes';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { noteStorage } from '@/lib/storage/noteStorage';
import { STORAGE_KEY } from '@/utils/noteUtils';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  
  // Load notes on initialization
  useEffect(() => {
    try {
      console.log('useNotes: Loading notes from storage');
      const loadedNotes = noteStorage.loadNotes();
      console.log(`useNotes: Loaded ${loadedNotes.length} notes`);
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
      setNotes([]);
    }
    
    // Listen for storage changes
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
    
    // Listen for custom events
    const handleNotesUpdated = () => {
      try {
        console.log('useNotes: Notes updated event received');
        const loadedNotes = noteStorage.loadNotes();
        console.log(`useNotes: Reloaded ${loadedNotes.length} notes after update`);
        setNotes(loadedNotes);
      } catch (error) {
        console.error('Error loading updated notes:', error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notesUpdated', handleNotesUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notesUpdated', handleNotesUpdated);
    };
  }, []);
  
  // Update current content
  const updateCurrentContent = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);
  
  // Select note for editing
  const selectNoteForEdit = useCallback((note: Note) => {
    console.log('Selecting note for edit:', note.id);
    setSelectedNote(note);
    setCurrentContent(note.content);
  }, []);
  
  // Clear selected note
  const clearSelectedNote = useCallback(() => {
    setSelectedNote(null);
    setCurrentContent('');
  }, []);
  
  // Add a new note
  const addNote = useCallback((): Note | null => {
    if (!currentContent.trim()) {
      toast.error('Cannot save empty note');
      return null;
    }
    
    try {
      const newNote: Note = {
        id: uuidv4(),
        title: 'New Note', // Required by the Note type
        content: currentContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: []
      };
      
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      noteStorage.saveNotes(updatedNotes);
      setCurrentContent('');
      
      toast.success('Note created ✨');
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to create note');
      return null;
    }
  }, [currentContent, notes]);
  
  // Update an existing note
  const updateNote = useCallback((noteId: string, content: string): boolean => {
    try {
      const updatedNotes = notes.map(note => 
        note.id === noteId 
          ? { ...note, content, updatedAt: new Date().toISOString() } 
          : note
      );
      
      setNotes(updatedNotes);
      noteStorage.saveNotes(updatedNotes);
      
      if (selectedNote?.id === noteId) {
        clearSelectedNote();
      }
      
      toast.success('Note updated ✨');
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
      return false;
    }
  }, [notes, selectedNote, clearSelectedNote]);
  
  // Save or update a note - for API compatibility
  const saveNote = useCallback((note: Note): boolean => {
    try {
      const existingNoteIndex = notes.findIndex(n => n.id === note.id);
      let updatedNotes: Note[];
      
      if (existingNoteIndex >= 0) {
        // Update existing note
        updatedNotes = [...notes];
        updatedNotes[existingNoteIndex] = {
          ...note,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Add new note
        updatedNotes = [
          {
            ...note,
            createdAt: note.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          ...notes
        ];
      }
      
      setNotes(updatedNotes);
      noteStorage.saveNotes(updatedNotes);
      
      if (selectedNote?.id === note.id) {
        clearSelectedNote();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
      return false;
    }
  }, [notes, selectedNote, clearSelectedNote]);
  
  // Delete a note
  const deleteNote = useCallback((noteId: string): boolean => {
    try {
      const success = noteStorage.deleteNote(noteId);
      
      if (success) {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        
        if (selectedNote?.id === noteId) {
          clearSelectedNote();
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  }, [notes, selectedNote, clearSelectedNote]);
  
  // Add tag to note
  const addTagToNote = useCallback((noteId: string, tagName: string, color: TagColor = 'default'): boolean => {
    try {
      const success = noteStorage.addTagToNote(noteId, tagName, color);
      
      if (success) {
        // Reload notes to reflect changes
        const updatedNotes = noteStorage.loadNotes();
        setNotes(updatedNotes);
      }
      
      return success;
    } catch (error) {
      console.error('Error adding tag to note:', error);
      toast.error('Failed to add tag');
      return false;
    }
  }, []);
  
  // Remove tag from note
  const removeTagFromNote = useCallback((noteId: string, tagName: string): boolean => {
    try {
      const success = noteStorage.removeTagFromNote(noteId, tagName);
      
      if (success) {
        // Reload notes to reflect changes
        const updatedNotes = noteStorage.loadNotes();
        setNotes(updatedNotes);
      }
      
      return success;
    } catch (error) {
      console.error('Error removing tag from note:', error);
      toast.error('Failed to remove tag');
      return false;
    }
  }, []);
  
  return {
    notes,
    selectedNote,
    currentContent,
    updateCurrentContent,
    selectNoteForEdit,
    clearSelectedNote,
    addNote,
    updateNote,
    saveNote,
    deleteNote,
    addTagToNote,
    removeTagFromNote
  };
};
