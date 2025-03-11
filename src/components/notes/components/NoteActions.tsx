import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';
import { cn } from '@/lib/utils';
import type { Note } from '@/types/notes';

interface NoteActionsProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (noteId: string) => void;
  compact?: boolean;
}

export const NoteActions: React.FC<NoteActionsProps> = ({ 
  note, 
  onEdit,
  onDelete,
  compact = false 
}) => {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <ActionButton
          icon={Edit2}
          onClick={(e) => {
            e.stopPropagation(); // Stop event from bubbling to parent
            if (onEdit) onEdit(note);
          }}
          className={cn(
            "p-0",
            compact ? "h-5 w-5" : "h-6 w-6"
          )}
        />
      )}
      <ActionButton
        icon={Trash2}
        onClick={(e) => {
          e.stopPropagation(); // Stop event from bubbling to parent
          onDelete(note.id);
        }}
        className={cn(
          "p-0 text-destructive/70 hover:text-destructive",
          compact ? "h-5 w-5" : "h-6 w-6"
        )}
      />
    </div>
  );
};
