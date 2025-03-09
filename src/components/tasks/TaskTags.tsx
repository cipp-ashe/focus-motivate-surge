
import React, { useState, useEffect } from "react";
import { NoteTags } from "../notes/components/NoteTags";
import { Tag } from "@/types/core";
import { Task } from "@/types/tasks";
import { useTagSystem } from "@/hooks/useTagSystem";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";

interface TaskTagsProps {
  task: Task;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskTags = ({ task, preventPropagation }: TaskTagsProps) => {
  const { getEntityTags, addTagToEntity, removeTagFromEntity, updateTagColor } = useTagSystem();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const updateTags = () => {
      if (!task?.id) return;
      
      console.log(`Updating tags for task ${task.id}`);
      const currentTags = getEntityTags(task.id, 'task');
      // Deduplicate tags by name
      const uniqueTags = currentTags.reduce((acc: Tag[], current) => {
        const exists = acc.find(tag => tag.name === current.name);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      setTags(uniqueTags);
    };

    // Initial tag loading
    updateTags();
    
    // Event listeners for tag updates
    window.addEventListener('tagsUpdated', updateTags);
    
    // Listen for template deletions to refresh tags
    const handleTemplateDelete = () => {
      setTimeout(updateTags, 100); // Refresh tags after short delay
    };
    
    // Listen for force task updates
    const handleTaskUpdate = () => {
      setTimeout(updateTags, 100); // Refresh tags after short delay
    };
    
    const unsubscribeTemplateDelete = eventBus.on('habit:template-delete', handleTemplateDelete);
    window.addEventListener('force-task-update', handleTaskUpdate);
    
    return () => {
      window.removeEventListener('tagsUpdated', updateTags);
      window.removeEventListener('force-task-update', handleTaskUpdate);
      unsubscribeTemplateDelete();
    };
  }, [task?.id, getEntityTags]);

  const handleAddTag = (tagName: string) => {
    // Check if tag already exists before adding
    const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
    if (!existingTag) {
      addTagToEntity(tagName, task.id, 'task');
      
      // Force immediate UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('tagsUpdated'));
      }, 50);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    if (tagName === 'Habit') {
      toast.error("Cannot remove Habit tag");
      return;
    }
    removeTagFromEntity(tagName, task.id, 'task');
    
    // Force immediate UI update
    setTimeout(() => {
      window.dispatchEvent(new Event('tagsUpdated'));
    }, 50);
  };

  const handleTagClick = (tag: Tag) => {
    if (tag.name === 'Habit') return;
    
    const colors: Tag['color'][] = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
    const currentIndex = colors.indexOf(tag.color);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    
    updateTagColor(tag.name, nextColor);
    
    // Force immediate UI update
    setTimeout(() => {
      window.dispatchEvent(new Event('tagsUpdated'));
    }, 50);
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div 
      className="flex items-center flex-wrap gap-1"
      onClick={preventPropagation}
      onTouchStart={preventPropagation}
    >
      <NoteTags
        tags={tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onTagClick={handleTagClick}
      />
    </div>
  );
};
