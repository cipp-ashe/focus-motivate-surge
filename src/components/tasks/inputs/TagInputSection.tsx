
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon, Plus } from "lucide-react";
import { Tag } from '@/types/tasks';

interface TagInputSectionProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
}

export const TagInputSection: React.FC<TagInputSectionProps> = ({
  tags,
  onAddTag,
  onRemoveTag
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  return (
    <>
      {/* Tags Display Row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="text-xs flex items-center gap-1 bg-secondary/70"
            >
              {tag}
              <button
                className="ml-1 hover:text-destructive focus:outline-none"
                onClick={() => onRemoveTag(index)}
              >
                ×
              </button>
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={() => setIsAddingTag(true)}
          >
            <Plus size={12} className="mr-1" />
            Add Tag
          </Button>
        </div>
      )}
      
      {/* Tag Input */}
      {isAddingTag && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 relative">
            <TagIcon size={14} className="absolute left-2 text-muted-foreground" />
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag"
              className="pl-8 bg-background/50 border-input/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
                if (e.key === 'Escape') setIsAddingTag(false);
              }}
              autoFocus
            />
          </div>
          <Button 
            size="sm" 
            onClick={handleAddTag}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsAddingTag(false)}
            className="border-input/50"
          >
            Cancel
          </Button>
        </div>
      )}
    </>
  );
};
