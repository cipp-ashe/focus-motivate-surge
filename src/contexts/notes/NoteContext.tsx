
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, TagColor } from '@/types/notes';
import { v4 as uuidv4 } from 'uuid';
import { noteStorage } from '@/lib/storage/noteStorage';
import { toast } from 'sonner';

// Context interfaces
interface NoteContextState {
  notes: Note[];
  selectedNote: Note | null;
  currentContent: string;
  updateCurrentContent: (content: string) => void;
  selectNoteForEdit: (note: Note) => void;
  clearSelectedNote: () => void;
  addNote: () => Note | null;
  updateNote: (noteId: string, content: string) => boolean;
  deleteNote: (noteId: string) => boolean;
  addTagToNote: (noteId: string, tagName: string, color?: TagColor) => boolean;
  removeTagFromNote: (noteId: string, tagName: string) => boolean;
}

// Create context
const NoteContext = createContext<NoteContextState | undefined>(undefined);

// Provider component
export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load notes from storage
  useEffect(() => {
    console.log('NoteContext: Loading notes from storage');
    const loadedNotes = noteStorage.loadNotes();
    console.log(`NoteContext: Loaded ${loadedNotes.length} notes`);
    setNotes(loadedNotes);
    setIsInitialized(true);

    // Listen for storage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notes') {
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
        console.log('NoteContext: Notes updated event received');
        const loadedNotes = noteStorage.loadNotes();
        console.log(`NoteContext: Reloaded ${loadedNotes.length} notes after update`);
        setNotes(loadedNotes);
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

  // Update current content
  const updateCurrentContent = (content: string) => {
    setCurrentContent(content);
  };

  // Select note for editing
  const selectNoteForEdit = (note: Note) => {
    setSelectedNote(note);
    setCurrentContent(note.content);
  };

  // Clear selected note
  const clearSelectedNote = () => {
    setSelectedNote(null);
    setCurrentContent('');
  };

  // Add a new note
  const addNote = (): Note | null => {
    if (!currentContent.trim()) {
      toast.error('Cannot save empty note');
      return null;
    }

    try {
      const newNote: Note = {
        id: uuidv4(),
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
  };

  // Update an existing note
  const updateNote = (noteId: string, content: string): boolean => {
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
  };

  // Delete a note
  const deleteNote = (noteId: string): boolean => {
    try {
      const success = noteStorage.deleteNote(noteId);
      
      if (success) {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        
        if (selectedNote?.id === noteId) {
          clearSelectedNote();
        }
        
        toast.success('Note deleted 🗑️');
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  };

  // Add tag to note
  const addTagToNote = (noteId: string, tagName: string, color: TagColor = 'default'): boolean => {
    try {
      return noteStorage.addTagToNote(noteId, tagName, color);
    } catch (error) {
      console.error('Error adding tag to note:', error);
      toast.error('Failed to add tag');
      return false;
    }
  };

  // Remove tag from note
  const removeTagFromNote = (noteId: string, tagName: string): boolean => {
    try {
      return noteStorage.removeTagFromNote(noteId, tagName);
    } catch (error) {
      console.error('Error removing tag from note:', error);
      toast.error('Failed to remove tag');
      return false;
    }
  };

  // Create context value
  const contextValue: NoteContextState = {
    notes,
    selectedNote,
    currentContent,
    updateCurrentContent,
    selectNoteForEdit,
    clearSelectedNote,
    addNote,
    updateNote,
    deleteNote,
    addTagToNote,
    removeTagFromNote
  };

  return (
    <NoteContext.Provider value={contextValue}>
      {children}
    </NoteContext.Provider>
  );
};

// Custom hook to use the context
export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};
