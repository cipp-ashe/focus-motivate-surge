
import { useState, useEffect, useCallback } from 'react';
import { Note, Tag, TagColor } from '@/types/notes';
import { createNewNote } from '@/utils/noteUtils';
import { useNotesStorage } from './useNotesStorage';
import { noteStorage } from '@/lib/storage/noteStorage';

export type { Note, Tag, TagColor };

/**
 * Hook for managing notes with consolidated storage
 */
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const { saveNotes, addTagToNote, removeTagFromNote, deleteNote } = useNotesStorage();

  // Load notes from storage
  useEffect(() => {
    const loadNotes = () => {
      const parsedNotes = noteStorage.loadNotes();
      setNotes(parsedNotes);
    };

    loadNotes();

    // Setup event listeners for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notes') {
        loadNotes();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notesUpdated', loadNotes);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notesUpdated', loadNotes);
    };
  }, []);

  const updateCurrentContent = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);

  const addNote = useCallback(() => {
    if (!currentContent.trim()) return null;
    
    const newNote = createNewNote(currentContent);
    const updatedNotes = [newNote, ...notes];
    
    saveNotes(updatedNotes);
    setCurrentContent('');
    
    return newNote;
  }, [currentContent, notes, saveNotes]);

  const updateNote = useCallback((noteId: string, content: string) => {
    if (!content.trim()) return;
    
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            content: content.trim(),
            updatedAt: new Date().toISOString()
          } 
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const updateTagColor = useCallback((noteId: string, tagName: string, color: TagColor) => {
    addTagToNote(noteId, tagName, color);
  }, [addTagToNote]);

  const selectNoteForEdit = useCallback((note: Note) => {
    if (!note) return;

    const currentNote = notes.find(n => n.id === note.id);
    if (!currentNote) return;

    setSelectedNote(currentNote);
    setCurrentContent(currentNote.content);
  }, [notes]);

  const clearSelectedNote = useCallback(() => {
    setSelectedNote(null);
    setCurrentContent('');
  }, []);

  return {
    notes,
    selectedNote,
    currentContent,
    updateCurrentContent,
    addNote,
    deleteNote,
    updateNote,
    addTagToNote,
    updateTagColor,
    removeTagFromNote,
    selectNoteForEdit,
    clearSelectedNote
  };
}
