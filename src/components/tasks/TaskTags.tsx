import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tag } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

interface TaskTagsProps {
  tags: Tag[];
  task?: any; // Added to accommodate the task prop passed from TaskContent
  onTagClick?: (tag: Tag) => void;
  onTagRemove?: (tagId: string) => void;
  readOnly?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  preventPropagation?: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskTags: React.FC<TaskTagsProps> = ({
  tags,
  onTagClick,
  onTagRemove,
  readOnly = false,
  variant = 'default',
  size = 'default',
  className = '',
  preventPropagation
}) => {
  const [localTags, setLocalTags] = useState<Tag[]>(tags || []);
  
  // Keep tags in sync with props
  useEffect(() => {
    setLocalTags(tags || []);
  }, [tags]);
  
  // Handle tag click
  const handleTagClick = (tag: Tag) => {
    if (onTagClick) {
      onTagClick(tag);
    } else {
      // Default behavior if no click handler provided
      console.log(`Tag clicked: ${tag.name}`);
      
      // Broadcast tag selection event - use as any as a workaround for now
      // @ts-ignore - Custom event type
      eventManager.emit('tag:select', { tagId: tag.id, tagName: tag.name });
    }
  };
  
  // Handle tag removal
  const handleTagRemove = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    if (readOnly) return;
    
    if (onTagRemove) {
      onTagRemove(tagId);
    } else {
      // Default behavior if no remove handler provided
      console.log(`Tag removal requested: ${tagId}`);
      
      // Update local state
      setLocalTags(prev => prev.filter(t => t.id !== tagId));
      
      // Broadcast tag removal event - use as any as a workaround for now
      // @ts-ignore - Custom event type
      eventManager.emit('tag:remove', { tagId });
    }
  };
  
  // Handle tag system events
  useEffect(() => {
    const handleForceUpdate = () => {
      // Refresh from localStorage or other source if needed
      console.log('TaskTags - Force update event received');
    };
    
    // Subscribe to these events with ts-ignore
    // @ts-ignore - Custom event types
    const unsubscribeForceUpdate = eventManager.on('tags:force-update', handleForceUpdate);
    // @ts-ignore - Custom event types
    const unsubscribeTagCreate = eventManager.on('tag:create', handleForceUpdate);
    // @ts-ignore - Custom event types
    const unsubscribeTagDelete = eventManager.on('tag:delete', handleForceUpdate);
    
    return () => {
      unsubscribeForceUpdate();
      unsubscribeTagCreate();
      unsubscribeTagDelete();
    };
  }, []);

  if (!localTags || localTags.length === 0) {
    return null;
  }

  // Define size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };
  
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`} onClick={preventPropagation}>
      {localTags.map((tag) => (
        <Badge
          key={tag.id}
          variant={variant}
          className={`
            cursor-pointer
            transition-all
            hover:opacity-90
            ${sizeClasses[size]}
            ${tag.color ? `bg-${tag.color}-500 hover:bg-${tag.color}-600` : ''}
          `}
          onClick={() => handleTagClick(tag)}
        >
          {tag.name}
          {!readOnly && (
            <span
              className="ml-1.5 inline-flex items-center justify-center text-xs font-medium opacity-70 hover:opacity-100"
              onClick={(e) => handleTagRemove(e, tag.id)}
            >
              ×
            </span>
          )}
        </Badge>
      ))}
    </div>
  );
};
