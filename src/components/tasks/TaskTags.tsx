
import { NoteTags } from "../notes/components/NoteTags";
import { Tag } from "@/types/core";
import { Task } from "@/types/tasks";
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

    updateTags();
    window.addEventListener('tagsUpdated', updateTags);
    return () => window.removeEventListener('tagsUpdated', updateTags);
  }, [task.id, getEntityTags]);

  const handleAddTag = (tagName: string) => {
    // Check if tag already exists before adding
    const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
    if (!existingTag) {
      addTagToEntity(tagName, task.id, 'task');
    }
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

