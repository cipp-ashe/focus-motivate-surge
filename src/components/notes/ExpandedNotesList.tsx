
import React, { useState } from 'react';
import type { Note } from '@/types/notes';
import { downloadNoteAsMarkdown } from '@/utils/downloadUtils';
import { NotesHeader } from './expanded/NotesHeader';
import { NoteItem } from './expanded/NoteItem';
import { NotesPagination } from './expanded/NotesPagination';

interface ExpandedNotesListProps {
  notes: Note[];
  onEditNote?: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
}

const MAX_NOTES = 4;

export const ExpandedNotesList = ({ 
  notes,
  onEditNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag
}: ExpandedNotesListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleDownloadNote = async (note: Note) => {
    await downloadNoteAsMarkdown(note);
  };

  const handleClearNotes = () => {
    localStorage.removeItem('notes');
    window.dispatchEvent(new Event('notesUpdated'));
  };

  const totalPages = Math.ceil(notes.length / MAX_NOTES);
  const paginatedNotes = notes.slice(
    currentPage * MAX_NOTES,
    (currentPage + 1) * MAX_NOTES
  );

  return (
    <div className="space-y-4">
      <NotesHeader onClearNotes={handleClearNotes} />

      {notes.length === 0 ? (
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
