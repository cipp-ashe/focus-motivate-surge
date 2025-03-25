
import React from 'react';
import { Note } from '@/types/notes';
import { NoteCard } from '@/components/notes/NoteCard';
import { cn } from '@/lib/utils';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  className?: string;
  isLoading?: boolean;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onToggleFavorite,
  className,
  isLoading = false
}) => {
  console.log('NotesList rendering with notes count:', notes.length);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (notes.length === 0) {
    return null;
  }
  
  return (
    <div className={cn("space-y-2 animate-fade-in", className)}>
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={() => onSelectNote(note)}
          onDelete={() => onDeleteNote(note.id)}
          onToggleFavorite={() => onToggleFavorite(note.id)}
        />
      ))}
    </div>
  );
};
