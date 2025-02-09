
import { NoteTags } from "../notes/components/NoteTags";
import { Tag } from "@/types/notes";
import { toast } from "sonner";
import { Task } from "./TaskList";
import { useState, useEffect } from "react";

interface TaskTagsProps {
  task: Task;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskTags = ({ task, preventPropagation }: TaskTagsProps) => {
  const [tags, setTags] = useState<Tag[]>(task.tags || []);

  useEffect(() => {
    setTags(task.tags || []);
  }, [task.tags]);

  const handleAddTag = (tagName: string) => {
    if (!task.tags) {
      task.tags = [];
    }
    
    if (task.tags.some(t => t.name === tagName)) {
      toast.error("Tag already exists");
      return;
    }

    task.tags.push({
      name: tagName,
      color: 'default'
    });
    
    setTags([...task.tags]);
    window.dispatchEvent(new Event('tagsUpdated'));
    toast.success("Tag added");
  };

  const handleRemoveTag = (tagName: string) => {
    if (!task.tags) return;
    
    if (tagName === 'Habit') {
      toast.error("Cannot remove Habit tag");
      return;
    }

    task.tags = task.tags.filter(t => t.name !== tagName);
    setTags([...task.tags]);
    window.dispatchEvent(new Event('tagsUpdated'));
    toast.success("Tag removed");
  };

  const handleTagClick = (tag: Tag) => {
    if (tag.name === 'Habit') return;
    
    const colors: Tag['color'][] = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
    const currentIndex = colors.indexOf(tag.color);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    
    if (!task.tags) return;
    
    const tagIndex = task.tags.findIndex(t => t.name === tag.name);
    if (tagIndex !== -1) {
      task.tags[tagIndex].color = nextColor;
      setTags([...task.tags]);
      window.dispatchEvent(new Event('tagsUpdated'));
    }
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
