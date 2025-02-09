
import React, { useState } from 'react';
import type { Note } from '@/hooks/useNotes';
import { NoteCard } from './NoteCard';
import { NotesDialog } from './NotesDialog';
import { NotesListHeader } from './NotesListHeader';
import { useNoteStorage } from '@/hooks/useNoteStorage';

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
  const { 
    handleClearNotes, 
    handleDeleteNote, 
    handleAddTag, 
    handleRemoveTag 
  } = useNoteStorage();

  const totalPages = Math.ceil(notes.length / MAX_NOTES);
  const paginatedNotes = notes.slice(
    currentPage * MAX_NOTES,
    (currentPage + 1) * MAX_NOTES
  );

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

