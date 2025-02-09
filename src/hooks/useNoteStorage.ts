
import { toast } from 'sonner';
import type { Note } from '@/hooks/useNotes';

export function useNoteStorage() {
  const handleClearNotes = () => {
    localStorage.removeItem('notes');
    window.dispatchEvent(new Event('notesUpdated'));
    toast.success("All notes cleared 🗑️");
  };

  const handleDeleteNote = (noteId: string) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const currentNotes: Note[] = JSON.parse(savedNotes);
      const newNotes = currentNotes.filter(note => note.id !== noteId);
      localStorage.setItem('notes', JSON.stringify(newNotes));
      window.dispatchEvent(new Event('notesUpdated'));
      toast.success("Note deleted 🗑️");
    }
  };

  const handleAddTag = (noteId: string, tagName: string) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
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
      window.dispatchEvent(new Event('notesUpdated'));
    }
  };

  const handleRemoveTag = (noteId: string, tagName: string) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const currentNotes: Note[] = JSON.parse(savedNotes);
      const updatedNotes = currentNotes.map(note => {
        if (note.id === noteId) {
          return { ...note, tags: note.tags.filter(t => t.name !== tagName) };
        }
        return note;
      });
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event('notesUpdated'));
    }
  };

  return {
    handleClearNotes,
    handleDeleteNote,
    handleAddTag,
    handleRemoveTag
  };
}

