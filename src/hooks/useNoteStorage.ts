
import { useState } from 'react';
import { toast } from 'sonner';
import type { Note } from '@/types/notes';

interface NoteStorageState {
  isLoading: boolean;
  error: Error | null;
}

export function useNoteStorage() {
  const [state, setState] = useState<NoteStorageState>({
    isLoading: false,
    error: null
  });

  const handleOperation = async <T>(
    operation: () => T,
    successMessage: string,
    errorMessage: string
  ): Promise<T | undefined> => {
    setState({ isLoading: true, error: null });
    try {
      const result = operation();
      window.dispatchEvent(new Event('notesUpdated'));
      toast.success(successMessage);
      setState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(errorMessage);
      setState({ isLoading: false, error: errorObj });
      toast.error(`${errorMessage}: ${errorObj.message}`);
      console.error('Note storage error:', error);
    }
  };

  const handleClearNotes = () => {
    return handleOperation(
      () => localStorage.removeItem('notes'),
      "All notes cleared 🗑️",
      "Failed to clear notes"
    );
  };

  const handleDeleteNote = (noteId: string) => {
    return handleOperation(
      () => {
        const savedNotes = localStorage.getItem('notes');
        if (!savedNotes) throw new Error('No notes found');
        
        const currentNotes: Note[] = JSON.parse(savedNotes);
        const newNotes = currentNotes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(newNotes));
      },
      "Note deleted 🗑️",
      "Failed to delete note"
    );
  };

  const handleAddTag = (noteId: string, tagName: string) => {
    if (!tagName.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }

    return handleOperation(
      () => {
        const savedNotes = localStorage.getItem('notes');
        if (!savedNotes) throw new Error('No notes found');

        const currentNotes: Note[] = JSON.parse(savedNotes);
        const updatedNotes = currentNotes.map(note => {
          if (note.id === noteId) {
            const newTag = { name: tagName.trim(), color: 'default' as const };
            return { 
              ...note, 
              tags: [...note.tags.filter(t => t.name !== newTag.name), newTag]
            };
          }
          return note;
        });
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
      },
      "Tag added ✨",
      "Failed to add tag"
    );
  };

  const handleRemoveTag = (noteId: string, tagName: string) => {
    return handleOperation(
      () => {
        const savedNotes = localStorage.getItem('notes');
        if (!savedNotes) throw new Error('No notes found');

        const currentNotes: Note[] = JSON.parse(savedNotes);
        const updatedNotes = currentNotes.map(note => {
          if (note.id === noteId) {
            return { ...note, tags: note.tags.filter(t => t.name !== tagName) };
          }
          return note;
        });
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
      },
      "Tag removed 🗑️",
      "Failed to remove tag"
    );
  };

  return {
    ...state,
    handleClearNotes,
    handleDeleteNote,
    handleAddTag,
    handleRemoveTag
  };
}
