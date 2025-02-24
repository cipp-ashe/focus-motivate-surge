
import React, { useState, useCallback } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';
import type { Note } from '@/hooks/useNotes';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NoteTags } from './NoteTags';
import { NoteActions } from './NoteActions';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
  compact?: boolean;
}

export const NoteCard = ({ 
  note,
  onEdit,
  onDelete,
  onAddTag,
  onRemoveTag,
  compact = false
}: NoteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = format(new Date(note.updatedAt || note.createdAt), compact ? 'HH:mm' : 'MMM d, HH:mm');

  const previewLength = compact ? 40 : 80;
  const previewContent = note.content.length > previewLength 
    ? `${note.content.slice(0, previewLength)}...`
    : note.content;

  return (
    <div 
      className={cn(
        "group relative px-2 py-1.5 rounded-md border border-primary/10 bg-card/30",
        "backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:bg-accent/5 w-full",
        compact ? "text-sm" : "",
        "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between gap-1 min-w-0">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <div className="relative min-w-0 flex-1">
            <span className={cn(
              "text-foreground/90 block",
              "after:absolute after:right-0 after:top-0 after:h-full after:w-16",
              "after:bg-gradient-to-r after:from-transparent after:to-card/30",
              !isExpanded && "line-clamp-1",
              compact && "text-sm"
            )}>
              {isExpanded ? note.content : previewContent}
            </span>
          </div>
          <div className={cn(
            "flex items-center gap-1 shrink-0",
            compact ? "flex-col items-end" : "flex-row"
          )}>
            {!compact && (
              <NoteTags
                tags={note.tags}
                onAddTag={(tagName) => onAddTag(note.id, tagName)}
                onRemoveTag={(tagName) => onRemoveTag(note.id, tagName)}
                compact={compact}
              />
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
              <span>{formattedDate}</span>
            </div>
            <ActionButton
              icon={isExpanded ? ChevronUp : ChevronDown}
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "p-0 opacity-0 group-hover:opacity-100",
                compact ? "h-4 w-4" : "h-5 w-5"
              )}
            />
          </div>
        </div>
        <NoteActions
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={compact}
        />
      </div>
    </div>
  );
};
