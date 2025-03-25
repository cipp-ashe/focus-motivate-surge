
import React from 'react';
import { format } from 'date-fns';
import { Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note } from '@/types/notes';
import { ActionButton } from '@/components/ui/action-button';
import { NoteTagList } from '@/components/notes/NoteTagList';
import { getNoteTitleColor, getNoteTypeIcon } from '@/utils/noteUtils';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isSelected,
  onSelect,
  onDelete,
  onToggleFavorite
}) => {
  // Format date
  const formattedDate = format(new Date(note.updatedAt), 'MMM d, yyyy h:mm a');
  
  // Get note type icon
  const NoteTypeIcon = getNoteTypeIcon(note.type);
  
  // Truncate content for preview
  const truncatedContent = note.content.length > 100
    ? `${note.content.substring(0, 100)}...`
    : note.content;
    
  return (
    <div 
      className={cn(
        "group relative rounded-md p-3 cursor-pointer transition-colors",
        isSelected 
          ? "bg-primary/10 dark:bg-primary/20 border border-primary/20" 
          : "hover:bg-muted/50 dark:hover:bg-muted/10 border border-transparent",
        "animate-fade-in"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-2">
          <div className={cn(
            "rounded-full p-1.5 mt-0.5",
            getNoteTitleColor(note.type)
          )}>
            <NoteTypeIcon className="h-3.5 w-3.5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className={cn(
                "font-medium truncate",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {note.title || 'Untitled Note'}
              </h3>
              
              {note.favorite && (
                <Star className="h-3.5 w-3.5 ml-1 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {truncatedContent || 'No content'}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <NoteTagList tags={note.tags} size="sm" />
              
              <span className="text-xs text-muted-foreground">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <ActionButton
            icon={Star}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="h-7 w-7"
            variant={note.favorite ? 'default' : 'ghost'}
            iconClassName={note.favorite ? 'fill-yellow-400 text-yellow-400' : ''}
          />
          
          <ActionButton
            icon={Trash2}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 w-7"
            variant="ghost"
          />
        </div>
      </div>
    </div>
  );
};
