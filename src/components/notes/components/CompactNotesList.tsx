
import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import type { Note, Tag } from '@/types/notes';
import { NoteCard } from './NoteCard';
import { NotesDialog } from './NotesDialog';
import { NotesPagination } from './NotesPagination';
import { ActionButton } from '@/components/ui/action-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { downloadAllNotes } from '@/utils/downloadUtils';
import { toast } from 'sonner';
import { useNoteStorage } from '@/hooks/useNoteStorage';
import { usePagination } from '@/hooks/usePagination';

// Define this constant
const MAX_NOTES = 4;

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
  console.log('CompactNotesList rendered with', notes?.length, 'notes');
  
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
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground">Recent Notes</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ActionButton
              icon={Download}
              onClick={() => downloadAllNotes(notes)}
              className="h-6 w-6 p-0"
            />
            <ActionButton
              icon={Trash2}
              onClick={() => setShowClearDialog(true)}
              className="h-6 w-6 p-0"
            />
          </div>
          <NotesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            compact
          />
        </div>
      </div>

      <ScrollArea className="h-[200px] w-full rounded-md border border-primary/10 bg-card/30 backdrop-blur-sm p-2">
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
