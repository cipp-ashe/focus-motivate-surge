
import React from 'react';
import { ActionButton } from '@/components/ui/action-button';
import { Download, Edit2, Trash2 } from 'lucide-react';
import type { Note } from '@/hooks/useNotes';
import { downloadNoteAsMarkdown } from '@/utils/downloadUtils';

interface NoteActionsProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export const NoteActions = ({ note, onEdit, onDelete }: NoteActionsProps) => {
  const handleDownload = async () => {
    await downloadNoteAsMarkdown(note);
  };

  return (
    <div className="flex items-center gap-1 shrink-0">
      <ActionButton
        icon={Download}
        onClick={handleDownload}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
      />
      {onEdit && (
        <ActionButton
          icon={Edit2}
          onClick={() => onEdit(note)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
        />
      )}
      <ActionButton
        icon={Trash2}
        onClick={() => onDelete(note.id)}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
      />
    </div>
  );
};
