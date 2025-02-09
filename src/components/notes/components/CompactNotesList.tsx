
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { Note } from '@/hooks/useNotes';
import { NoteCard } from './NoteCard';
import { NotesDialog } from './NotesDialog';
import { NotesListHeader } from './NotesListHeader';

interface CompactNotesListProps {
  notes: Note[];
  onEditNote?: (note: Note) => void;
  inExpandedView?: boolean;
}

const MAX_NOTES = 4;

export const CompactNotesList = ({ 
  notes,
  onEditNote,
  inExpandedView = false
}: CompactNotesListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const totalPages = Math.ceil(notes.length / MAX_NOTES);
  const paginatedNotes = notes.slice(
    currentPage * MAX_NOTES,
    (currentPage + 1) * MAX_NOTES
  );

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

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <NotesListHeader
        notes={notes}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onClearClick={() => setShowClearDialog(true)}
        compact
      />

      <div className="grid gap-1.5">
        {paginatedNotes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEditNote}
            onDelete={handleDeleteNote}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            compact
          />
        ))}
      </div>

      <NotesDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear all notes?"
        description="This action cannot be undone. All notes will be permanently deleted."
        actionText="Clear All"
        onAction={handleClearNotes}
        variant="destructive"
        inExpandedView={inExpandedView}
      />
    </div>
  );
};
