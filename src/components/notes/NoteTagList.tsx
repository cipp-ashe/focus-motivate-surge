
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NoteTag } from '@/types/notes';
import { cn } from '@/lib/utils';
import { getTagColor } from '@/utils/noteUtils';

interface NoteTagListProps {
  tags: NoteTag[];
  onRemoveTag?: (tagName: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const NoteTagList: React.FC<NoteTagListProps> = ({
  tags,
  onRemoveTag,
  size = 'md',
  className
}) => {
  if (tags.length === 0) {
    return null;
  }
  
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map(tag => (
        <Badge
          key={tag.name}
          variant="outline"
          className={cn(
            "group transition-colors",
            getTagColor(tag.color),
            size === 'sm' && "text-xs py-0 px-1.5 h-5"
          )}
        >
          {tag.name}
          
          {onRemoveTag && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(tag.name);
              }}
              className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity"
            >
              <X className={cn(
                size === 'sm' ? "h-3 w-3" : "h-3.5 w-3.5"
              )} />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
};
