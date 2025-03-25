import React, { useState, useMemo } from 'react';
import { useNotesContext } from '@/contexts/notes/NotesContext';
import { Note } from '@/types/notes';
import { NoteCard } from './NoteCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { filterNotes, sortNotes } from '@/utils/noteUtils';
import { NotesPagination } from './NotesPagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

export const NotesList: React.FC = () => {
  const { state, createNote, selectNote } = useNotesContext();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    const filtered = filterNotes(
      state.notes,
      state.searchTerm,
      state.filter,
      null,
      state.showArchived
    );

    return sortNotes(filtered, state.sortBy, state.sortDirection);
  }, [
    state.notes,
    state.searchTerm,
    state.filter,
    state.showArchived,
    state.sortBy,
    state.sortDirection,
  ]);

  // Calculate pagination
  const totalNotes = filteredAndSortedNotes.length;
  const totalPages = Math.max(1, Math.ceil(totalNotes / itemsPerPage));
  const currentPageNotes = filteredAndSortedNotes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle creating a new note
  const handleNewNote = () => {
    const id = createNote({
      title: 'New Note', // Title for the new note
      content: '', // Empty content initially
      type: 'standard', // Default type
      tags: [], // No tags initially
      createdAt: new Date().toISOString(), // Current timestamp
      updatedAt: new Date().toISOString(), // Current timestamp
      favorite: false, // Not favorited by default
      archived: false, // Not archived by default
      pinned: false, // Not pinned by default
    });

    selectNote(id);
  };

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {totalNotes} {totalNotes === 1 ? 'Note' : 'Notes'}
        </h2>
        <Button onClick={handleNewNote} size="sm" className="ml-auto">
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>

      <div
        className={cn(
          'flex-1 overflow-auto',
          state.view === 'grid' ? 'grid grid-cols-1 gap-2 p-3' : 'flex flex-col'
        )}
      >
        {currentPageNotes.length > 0 ? (
          currentPageNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === state.selectedNoteId}
              view={state.view}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-muted-foreground mb-4">
              {state.searchTerm || state.filter
                ? 'No notes match your filters'
                : "You don't have any notes yet"}
            </p>
            <Button onClick={handleNewNote} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create your first note
            </Button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border p-2">
          <NotesPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};
