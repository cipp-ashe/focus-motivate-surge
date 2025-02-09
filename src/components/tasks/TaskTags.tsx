
import { NoteTags } from "../notes/components/NoteTags";
import { Tag } from "@/types/core";
import { Task } from "./TaskList";
import { useState, useEffect } from "react";
import { useTagSystem } from "@/hooks/useTagSystem";
import { toast } from "sonner";

interface TaskTagsProps {
  task: Task;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskTags = ({ task, preventPropagation }: TaskTagsProps) => {
  const { getEntityTags, addTagToEntity, removeTagFromEntity, updateTagColor } = useTagSystem();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const updateTags = () => {
      // Ensure we're getting tags for the correct task
      const currentTags = getEntityTags(task.id, 'task');
      
      // Combine system tags with task.tags if they exist
      const combinedTags = [...currentTags];
      if (task.tags) {
        task.tags.forEach(tag => {
          if (!combinedTags.some(t => t.name === tag.name)) {
            // Add tag to the system if it doesn't exist
            addTagToEntity(tag.name, task.id, 'task');
          }
        });
      }
      
      setTags(combinedTags);
    };

    updateTags();
    
    // Listen for tag updates
    window.addEventListener('tagsUpdated', updateTags);
    return () => window.removeEventListener('tagsUpdated', updateTags);
  }, [task.id, task.tags, getEntityTags, addTagToEntity]);

  const handleAddTag = (tagName: string) => {
    addTagToEntity(tagName, task.id, 'task');
  };

  const handleRemoveTag = (tagName: string) => {
    if (tagName === 'Habit') {
      toast.error("Cannot remove Habit tag");
      return;
    }
    removeTagFromEntity(tagName, task.id, 'task');
  };

  const handleTagClick = (tag: Tag) => {
    if (tag.name === 'Habit') return;
    
    const colors: Tag['color'][] = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
    const currentIndex = colors.indexOf(tag.color);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    
    updateTagColor(tag.name, nextColor);
  };

  // Only render if we have tags
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

