
import React from 'react';
import { ActionButton } from '@/components/ui/action-button';
import { Download, Edit2, Trash2 } from 'lucide-react';
import type { Note } from '@/hooks/useNotes';
import { downloadNoteAsMarkdown } from '@/utils/downloadUtils';
import { cn } from '@/lib/utils';

interface NoteActionsProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (noteId: string) => void;
  compact?: boolean;
}

export const NoteActions = ({ 
  note, 
  onEdit, 
  onDelete,
  compact = false 
}: NoteActionsProps) => {
  const handleDownload = async () => {
    await downloadNoteAsMarkdown(note);
  };

  const iconSize = compact ? "h-3 w-3" : "h-4 w-4";
  const buttonSize = compact ? "h-5 w-5" : "h-6 w-6";

  return (
    <div className="flex items-center gap-1 shrink-0">
      <ActionButton
        icon={Download}
        onClick={handleDownload}
        className={cn(
          "p-0 opacity-0 group-hover:opacity-100",
          buttonSize
        )}
        iconClassName={iconSize}
      />
      {onEdit && (
        <ActionButton
          icon={Edit2}
          onClick={() => onEdit(note)}
          className={cn(
            "p-0 opacity-0 group-hover:opacity-100",
            buttonSize
          )}
          iconClassName={iconSize}
        />
      )}
      <ActionButton
        icon={Trash2}
        onClick={() => onDelete(note.id)}
        className={cn(
          "p-0 opacity-0 group-hover:opacity-100",
          buttonSize
        )}
        iconClassName={iconSize}
      />
    </div>
  );
};
