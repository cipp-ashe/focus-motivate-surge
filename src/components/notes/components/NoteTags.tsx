
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ActionButton } from '@/components/ui/action-button';
import { X, Plus } from 'lucide-react';
import type { Tag, TagColor } from '@/types/notes';
import { getTagStyles } from '../utils/tagUtils';
import { cn } from '@/lib/utils';

interface NoteTagsProps {
  tags: Tag[];
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onTagClick: (tag: Tag) => void;
  compact?: boolean;
}

export const NoteTags = ({
  tags,
  onAddTag,
  onRemoveTag,
  onTagClick,
  compact = false
}: NoteTagsProps) => {
  const [tagInput, setTagInput] = useState('');
  const [isEditingTags, setIsEditingTags] = useState(false);

  const handleAddTag = (tagName: string) => {
    if (!tagName.trim()) return;
    onAddTag(tagName);
    setTagInput('');
    setIsEditingTags(false);
  };

  return (
    <div className="flex items-center gap-1">
      {tags.map(tag => (
        <Badge 
          key={tag.name} 
          variant="secondary" 
          className={cn(
            "text-xs px-1.5 h-5 transition-colors cursor-pointer",
            getTagStyles(tag.color),
            compact && "text-[10px] px-1 h-4"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onTagClick(tag);
          }}
        >
          {tag.name}
          <X 
            className={cn(
              "ml-1 cursor-pointer opacity-50 hover:opacity-100",
              compact ? "h-2 w-2" : "h-3 w-3"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveTag(tag.name);
            }}
          />
        </Badge>
      ))}
      {isEditingTags ? (
        <div className="relative" onClick={e => e.stopPropagation()}>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag(tagInput);
              } else if (e.key === 'Escape') {
                setIsEditingTags(false);
                setTagInput('');
              }
            }}
            onBlur={() => {
              if (tagInput.trim()) {
                handleAddTag(tagInput);
              }
              setIsEditingTags(false);
            }}
            placeholder="Add tag"
            className={cn(
              "h-5 w-16 text-xs px-1.5",
              compact && "h-4 text-[10px]"
            )}
            autoFocus
          />
        </div>
      ) : (
        <ActionButton
          icon={Plus}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingTags(true);
          }}
          className={cn(
            "h-5 w-5 p-0 opacity-0 group-hover:opacity-100",
            compact && "h-4 w-4"
          )}
        />
      )}
    </div>
  );
};
