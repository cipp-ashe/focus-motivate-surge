
import React from 'react';
import { Edit, Trash2, Star, Download } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';
import { Note } from '@/types/notes';
import { downloadNote } from '@/utils/downloadUtils';
import { toast } from 'sonner';

interface NoteActionsProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleFavorite?: (noteId: string) => void;
  compact?: boolean;
}

export const NoteActions: React.FC<NoteActionsProps> = ({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
  compact = false
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
      toast.success('Note deleted');
    }
  };
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onToggleFavorite) {
      onToggleFavorite(note.id);
    }
  };
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadNote(note);
    toast.success('Note downloaded');
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onEdit) {
      onEdit(note);
    }
  };
  
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <ActionButton
          icon={Edit}
          onClick={handleEdit}
          variant="ghost"
          className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
          iconClassName="h-3.5 w-3.5"
          title="Edit note"
        />
      )}
      
      {onToggleFavorite && (
        <ActionButton
          icon={Star}
          onClick={handleFavorite}
          variant={note.favorite ? "default" : "ghost"}
          className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
          iconClassName={note.favorite ? "fill-yellow-400 text-yellow-400 h-3.5 w-3.5" : "h-3.5 w-3.5"}
          title={note.favorite ? "Remove from favorites" : "Add to favorites"}
        />
      )}
      
      <ActionButton
        icon={Download}
        onClick={handleDownload}
        variant="ghost"
        className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
        iconClassName="h-3.5 w-3.5"
        title="Download note"
      />
      
      <ActionButton
        icon={Trash2}
        onClick={handleDelete}
        variant="ghost"
        className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
        iconClassName="h-3.5 w-3.5"
        title="Delete note"
      />
    </div>
  );
};
