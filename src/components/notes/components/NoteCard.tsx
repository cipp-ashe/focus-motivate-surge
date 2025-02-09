
import React, { useState, useCallback } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';
import type { Note, Tag, TagColor } from '@/hooks/useNotes';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NoteTags } from './NoteTags';
import { NoteActions } from './NoteActions';
import { getNextColor } from '../utils/tagUtils';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
  onUpdateTagColor?: (noteId: string, tagName: string, color: TagColor) => void;
  compact?: boolean;
}

const PREVIEW_LENGTH = 80;

export const NoteCard = ({ 
  note,
  onEdit,
  onDelete,
  onAddTag,
  onRemoveTag,
  onUpdateTagColor,
  compact = false
}: NoteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localTags, setLocalTags] = useState<Tag[]>(note.tags);

  const handleTagClick = useCallback((tag: Tag) => {
    if (!onUpdateTagColor) return;

    const newColor = getNextColor(tag.color);
    // Update local state immediately
    setLocalTags(prevTags => 
      prevTags.map(t => 
        t.name === tag.name ? { ...t, color: newColor } : t
      )
    );
    // Update parent state
    onUpdateTagColor(note.id, tag.name, newColor);
  }, [note.id, onUpdateTagColor]);

  // Update local tags when note tags change
  React.useEffect(() => {
    setLocalTags(note.tags);
  }, [note.tags]);

  const formattedDate = format(new Date(note.updatedAt || note.createdAt), 'MMM d, HH:mm');

  const previewContent = note.content.length > PREVIEW_LENGTH 
    ? `${note.content.slice(0, PREVIEW_LENGTH)}...`
    : note.content;

  return (
    <div 
      className={cn(
        "group relative px-3 py-2 rounded-md border border-primary/10 bg-card/30",
        "backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:bg-accent/5 w-full",
        "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="relative min-w-0 flex-1">
            <span className={cn(
              "text-sm text-foreground/90 block",
              "after:absolute after:right-0 after:top-0 after:h-full after:w-16",
              "after:bg-gradient-to-r after:from-transparent after:to-card/30",
              !isExpanded && "line-clamp-1"
            )}>
              {isExpanded ? note.content : previewContent}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <NoteTags
              tags={localTags}
              onAddTag={(tagName) => onAddTag(note.id, tagName)}
              onRemoveTag={(tagName) => onRemoveTag(note.id, tagName)}
              onTagClick={handleTagClick}
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <ActionButton
              icon={isExpanded ? ChevronUp : ChevronDown}
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
            />
          </div>
        </div>
        <NoteActions
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};
