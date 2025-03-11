
import React, { useState, useEffect } from 'react';
import type { Note } from '@/types/notes';
import { downloadNoteAsMarkdown } from '@/utils/downloadUtils';
import { NotesHeader } from './expanded/NotesHeader';
import { NoteItem } from './expanded/NoteItem';
import { NotesPagination } from './expanded/NotesPagination';
import { toast } from 'sonner';

interface ExpandedNotesListProps {
  notes: Note[];
  onEditNote?: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
}

const MAX_NOTES = 4;

export const ExpandedNotesList = ({ 
  notes = [], // Default to empty array if notes is undefined
  onEditNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag
}: ExpandedNotesListProps) => {
  console.log('ExpandedNotesList rendered with', notes?.length, 'notes');
  
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Short delay to ensure child components are ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadNote = async (note: Note) => {
    try {
      await downloadNoteAsMarkdown(note);
      toast.success('Note downloaded successfully');
    } catch (error) {
      console.error('Error downloading note:', error);
      toast.error('Failed to download note');
    }
  };

  const handleClearNotes = () => {
    try {
      localStorage.removeItem('notes');
      window.dispatchEvent(new Event('notesUpdated'));
      toast.success('All notes cleared');
    } catch (error) {
      console.error('Error clearing notes:', error);
      toast.error('Failed to clear notes');
    }
  };

  const totalPages = Math.ceil((notes?.length || 0) / MAX_NOTES);
  const paginatedNotes = notes?.slice(
    currentPage * MAX_NOTES,
    (currentPage + 1) * MAX_NOTES
  ) || [];

  if (!isLoaded) {
    return <div className="p-2 text-sm text-muted-foreground">Loading notes...</div>;
  }

  return (
    <div className="space-y-4">
      <NotesHeader onClearNotes={handleClearNotes} />

      {!notes || notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">No notes yet</p>
          <p className="text-xs text-muted-foreground/60">Start writing to create your first note</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {paginatedNotes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              onEditNote={onEditNote}
              onDeleteNote={onDeleteNote}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onDownloadNote={handleDownloadNote}
            />
          ))}
        </div>
      )}

      <NotesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
