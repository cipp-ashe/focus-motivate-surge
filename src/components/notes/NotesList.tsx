
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
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onToggleFavorite
}) => {
  return (
    <div className="space-y-2 animate-fade-in">
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
