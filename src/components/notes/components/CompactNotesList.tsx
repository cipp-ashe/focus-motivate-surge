
import React, { useState } from 'react';
import type { Note } from '@/types/notes';
import { NoteCard } from './NoteCard';
import { NotesDialog } from './NotesDialog';
import { NotesListHeader } from './NotesListHeader';
import { useNoteStorage } from '@/hooks/useNoteStorage';
import { usePagination } from '@/hooks/usePagination';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CompactNotesListProps {
  notes: Note[];
  onEditNote?: (note: Note) => void;
  inExpandedView?: boolean;
}

export const CompactNotesList = ({ 
  notes = [],  // Default to empty array if notes is undefined
  onEditNote,
  inExpandedView = false
}: CompactNotesListProps) => {
  console.log('CompactNotesList rendered with', notes.length, 'notes');
  
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { 
    handleClearNotes, 
    handleDeleteNote, 
    handleAddTag, 
    handleRemoveTag 
  } = useNoteStorage();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedNotes
  } = usePagination({
    items: notes || [],  // Ensure we always have an array
    itemsPerPage: MAX_NOTES
  });

  if (!notes || notes.length === 0) {
    console.log('No notes to display in CompactNotesList');
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

      <ScrollArea className="h-[200px] w-full rounded-md border border-primary/10 bg-card/30 backdrop-blur-sm p-2">
        <div className="grid gap-1">
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
      </ScrollArea>

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

// Define this constant
const MAX_NOTES = 4;
