
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Download, Trash2 } from 'lucide-react';
import { NoteCard } from './components/NoteCard';
import { NotesDialog } from './components/NotesDialog';
import { NotesPagination } from './components/NotesPagination';
import { ActionButton } from '@/components/ui/action-button';
import { downloadAllNotes } from '@/utils/downloadUtils';
import { useNotes } from '@/hooks/useNotes';
import type { Note, TagColor } from '@/types/notes';

interface SavedNotesProps {
  onOpenEmailModal?: () => void;
  onEditNote?: (note: Note) => void;
  onUpdateTagColor?: (noteId: string, tagName: string, color: TagColor) => void;
}

const MAX_NOTES = 4;

export const SavedNotes = ({ onOpenEmailModal, onEditNote, onUpdateTagColor }: SavedNotesProps) => {
  console.log('SavedNotes component rendered');
  
  const { 
    notes,
    deleteNote,
    addTagToNote,
    removeTagFromNote
  } = useNotes();
  
  console.log('Notes from useNotes hook:', notes?.length || 0, 'notes available');
  
  const [currentPage, setCurrentPage] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleDeleteNote = (noteId: string) => {
    console.log('Attempting to delete note:', noteId);
    deleteNote(noteId);
    toast.success("Note deleted 🗑️");
  };

  const handleAddTag = (noteId: string, tagName: string) => {
    if (!tagName.trim()) return;
    console.log('Adding tag to note:', noteId, tagName);
    addTagToNote(noteId, tagName);
  };

  const handleRemoveTag = (noteId: string, tagName: string) => {
    console.log('Removing tag from note:', noteId, tagName);
    removeTagFromNote(noteId, tagName);
  };

  const handleClearNotes = () => {
    console.log('Clearing all notes');
    localStorage.removeItem('notes');
    window.dispatchEvent(new Event('notesUpdated'));
    toast.success("All notes cleared 🗑️");
  };

  // Safely calculate total pages
  const safeNotes = notes || [];
  const totalPages = Math.max(1, Math.ceil(safeNotes.length / MAX_NOTES));
  
  // Ensure currentPage is within bounds
  const safePage = Math.min(Math.max(0, currentPage), Math.max(0, totalPages - 1));
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }
  
  // Safely slice the notes array
  const paginatedNotes = safeNotes.slice(
    safePage * MAX_NOTES,
    (safePage + 1) * MAX_NOTES
  );

  console.log('Paginated notes:', paginatedNotes.length, 'on page', safePage + 1, 'of', totalPages);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Saved Notes</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ActionButton
              icon={Download}
              onClick={() => downloadAllNotes(safeNotes)}
              className="h-7 w-7 p-0"
            />
            <ActionButton
              icon={Trash2}
              onClick={() => setShowClearDialog(true)}
              className="h-7 w-7 p-0"
            />
          </div>
          <NotesPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Notes List */}
      {safeNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">No notes yet</p>
          <p className="text-xs text-muted-foreground/60">Start writing to create your first note</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {paginatedNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEditNote}
              onDelete={handleDeleteNote}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onUpdateTagColor={onUpdateTagColor}
            />
          ))}
        </div>
      )}

      {/* Clear Notes Dialog */}
      <NotesDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear all notes?"
        description="This action cannot be undone. All notes will be permanently deleted."
        actionText="Clear All"
        onAction={handleClearNotes}
        variant="destructive"
      />
    </div>
  );
};
