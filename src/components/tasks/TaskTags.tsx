
import { NoteTags } from "../notes/components/NoteTags";
import { Tag } from "@/types/notes";
import { toast } from "sonner";
import { Task } from "./TaskList";

interface TaskTagsProps {
  task: Task;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskTags = ({ task, preventPropagation }: TaskTagsProps) => {
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
      window.dispatchEvent(new Event('tagsUpdated'));
    }
  };

  if (!task.tags || task.tags.length === 0) return null;

  return (
    <div 
      className="flex items-center"
      onClick={preventPropagation}
      onTouchStart={preventPropagation}
    >
      <NoteTags
        tags={task.tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onTagClick={handleTagClick}
      />
    </div>
  );
};
