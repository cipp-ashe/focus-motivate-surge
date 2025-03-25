
import React from 'react';
import { NoteTag } from '@/types/notes';
import { getTagColor } from '@/utils/noteUtils';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteTagListProps {
  tags: NoteTag[];
  onRemove?: (tagId: string) => void;
  interactive?: boolean;
}

export const NoteTagList: React.FC<NoteTagListProps> = ({ 
  tags, 
  onRemove,
  interactive = false
}) => {
  if (!tags.length) {
    return null;
  }
  
  return (
    <>
      {tags.map(tag => (
        <div 
          key={tag.id}
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs",
            getTagColor(tag.color),
            interactive && "transition-colors hover:bg-opacity-80"
          )}
        >
          <span>{tag.name}</span>
          
          {onRemove && (
            <button
              type="button"
              className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              onClick={() => onRemove(tag.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag.name}</span>
            </button>
          )}
        </div>
      ))}
    </>
  );
};
