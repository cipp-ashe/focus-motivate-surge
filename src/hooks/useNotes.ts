
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Note, Tag, TagColor } from '@/types/notes';
import { STORAGE_KEY, parseStoredNotes, createNewNote, sanitizeContent } from '@/utils/noteUtils';
import { useNotesStorage } from './useNotesStorage';

export type { Note, Tag, TagColor };

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const { saveNotes } = useNotesStorage();

  useEffect(() => {
    const loadNotes = () => {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      const parsedNotes = parseStoredNotes(savedNotes);
      setNotes(parsedNotes);
    };

    loadNotes();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
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

  const deleteNote = useCallback((noteId: string) => {
    const newNotes = notes.filter(note => note.id !== noteId);
    saveNotes(newNotes);
    
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setCurrentContent('');
    }
  }, [notes, selectedNote, saveNotes]);

  const updateNote = useCallback((noteId: string, content: string) => {
    if (!content.trim()) return;
    
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            content: sanitizeContent(content.trim()),
            updatedAt: new Date().toISOString()
          } 
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const addTagToNote = useCallback((noteId: string, tagName: string) => {
    if (!tagName.trim()) return;

    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            tags: [...note.tags, { name: tagName.trim(), color: 'default' as TagColor }]
          }
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const updateTagColor = useCallback((noteId: string, tagName: string, color: TagColor) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? {
            ...note,
            tags: note.tags.map(tag => 
              tag.name === tagName ? { ...tag, color } : tag
            )
          }
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const removeTagFromNote = useCallback((noteId: string, tagName: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, tags: note.tags.filter(tag => tag.name !== tagName) }
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

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

