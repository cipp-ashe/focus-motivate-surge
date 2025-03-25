
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TagColor } from '@/types/notes';
import { cn } from '@/lib/utils';
import { getTagColor } from '@/utils/noteUtils';

interface NoteTagsProps {
  tags: Array<{ name: string; color: TagColor }>;
  onTagClick?: (tag: { name: string; color: TagColor }) => void;
  onAddTag?: (tagName: string) => void;
  onRemoveTag?: (tagName: string) => void;
  compact?: boolean;
  className?: string;
}

export const NoteTags: React.FC<NoteTagsProps> = ({
  tags = [],
  onTagClick,
  onAddTag,
  onRemoveTag,
  compact = false,
  className
}) => {
  const hasActions = !!onAddTag || !!onRemoveTag;
  
  if (!tags.length && !hasActions) {
    return null;
  }
  
  const handleAddTag = () => {
    if (!onAddTag) return;
    
    const tagName = window.prompt('Enter tag name:');
    if (tagName?.trim()) {
      onAddTag(tagName.trim());
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-wrap items-center gap-1.5", 
        compact ? "max-w-[150px]" : "",
        className
      )}
    >
      {tags.map(tag => (
        <Badge
          key={tag.name}
          variant="outline"
          className={cn(
            "group/tag transition-all",
            getTagColor(tag.color),
            compact ? "text-xs py-0 px-1.5 h-5" : "text-xs py-0.5 px-2 h-6",
            onTagClick ? "cursor-pointer" : "",
            "flex items-center"
          )}
          onClick={() => onTagClick && onTagClick(tag)}
        >
          <span className="truncate">{tag.name}</span>
          
          {onRemoveTag && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(tag.name);
              }}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
              aria-label={`Remove ${tag.name} tag`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
      
      {onAddTag && (
        <button
          type="button"
          onClick={handleAddTag}
          className="text-xs flex items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Add tag"
        >
          <Plus className="h-3 w-3 mr-0.5" />
          <span>Add</span>
        </button>
      )}
    </div>
  );
};
