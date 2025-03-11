
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
  // Add comprehensive error logging
  if (!note) {
    console.error('No note provided to NoteActions');
    return null;
  }
  
  if (!note.id) {
    console.error('Invalid note (missing ID) passed to NoteActions', note);
    return null;
  }
  
  console.log('Rendering NoteActions for note:', note.id);
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling to parent
    console.log('Edit clicked for note:', note.id);
    if (onEdit) onEdit(note);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling to parent
    console.log('Delete clicked for note:', note.id);
    try {
      onDelete(note.id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <ActionButton
          icon={Edit2}
          onClick={handleEdit}
          className={cn(
            "p-0",
            compact ? "h-5 w-5" : "h-6 w-6"
          )}
        />
      )}
      <ActionButton
        icon={Trash2}
        onClick={handleDelete}
        className={cn(
          "p-0 text-destructive/70 hover:text-destructive",
          compact ? "h-5 w-5" : "h-6 w-6"
        )}
      />
    </div>
  );
};
