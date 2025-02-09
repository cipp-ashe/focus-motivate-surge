
import { Task } from "./TaskList";
import { Sparkles, Clock, X } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { NoteTags } from "../notes/components/NoteTags";
import { Tag } from "@/types/notes";
import { toast } from "sonner";

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  editingTaskId: string | null;
  onTaskClick: (task: Task, event: React.MouseEvent<HTMLDivElement>) => void;
  onTaskDelete: (taskId: string) => void;
  onDurationChange: (taskId: string, newDuration: string) => void;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, taskId: string) => void;
  onInputBlur: () => void;
}

export const TaskRow = ({
  task,
  isSelected,
  editingTaskId,
  onTaskClick,
  onTaskDelete,
  onDurationChange,
  onDurationClick,
  onInputBlur,
}: TaskRowProps) => {
  const durationInMinutes = Math.round(Number(task.duration || 1500) / 60);
  const [inputValue, setInputValue] = useState(durationInMinutes.toString());

  useEffect(() => {
    if (task.duration) {
      setInputValue(Math.round(Number(task.duration) / 60).toString());
    }
  }, [task.duration]);

  const preventPropagation = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    let finalValue = '25';
    
    if (inputValue !== '') {
      const numValue = parseInt(inputValue, 10);
      if (!isNaN(numValue)) {
        finalValue = Math.min(Math.max(numValue, 1), 60).toString();
      }
    }
    
    setInputValue(finalValue);
    onDurationChange(task.id, (parseInt(finalValue) * 60).toString());
    onInputBlur();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onTaskDelete(task.id);
  };

  const handleAddTag = (tagName: string) => {
    if (!task.tags) {
      task.tags = [];
    }
    
    // Don't add duplicate tags
    if (task.tags.some(t => t.name === tagName)) {
      toast.error("Tag already exists");
      return;
    }

    // Add new tag with default color
    task.tags.push({
      name: tagName,
      color: 'default'
    });
    
    // Force a re-render
    window.dispatchEvent(new Event('tagsUpdated'));
    toast.success("Tag added");
  };

  const handleRemoveTag = (tagName: string) => {
    if (!task.tags) return;
    
    // Don't allow removing the Habit tag from habit tasks
    if (tagName === 'Habit') {
      toast.error("Cannot remove Habit tag");
      return;
    }

    task.tags = task.tags.filter(t => t.name !== tagName);
    
    // Force a re-render
    window.dispatchEvent(new Event('tagsUpdated'));
    toast.success("Tag removed");
  };

  const handleTagClick = (tag: Tag) => {
    // Preserve habit tag color
    if (tag.name === 'Habit') return;
    
    const colors: Tag['color'][] = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
    const currentIndex = colors.indexOf(tag.color);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    
    if (!task.tags) return;
    
    const tagIndex = task.tags.findIndex(t => t.name === tag.name);
    if (tagIndex !== -1) {
      task.tags[tagIndex].color = nextColor;
      // Force a re-render
      window.dispatchEvent(new Event('tagsUpdated'));
    }
  };

  return (
    <div
      className={`
        relative flex flex-col gap-2
        p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm
        cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-accent/10 border-primary/40' 
          : 'hover:border-primary/30 hover:bg-accent/5'
        }
      `}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => onTaskClick(task, e)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-foreground line-clamp-1">{task.name}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2"
            onClick={preventPropagation}
            onTouchStart={preventPropagation}
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            {editingTaskId === task.id ? (
              <Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={inputValue}
                className="w-16 text-right bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                onClick={preventPropagation}
                onTouchStart={preventPropagation}
              />
            ) : (
              <span 
                className="w-16 text-right text-muted-foreground cursor-text"
                onClick={(e) => onDurationClick(e, task.id)}
                onTouchStart={(e) => onDurationClick(e, task.id)}
              >
                {durationInMinutes}
              </span>
            )}
            <span className="text-muted-foreground">m</span>
          </div>
          
          <button
            onClick={handleDelete}
            onTouchStart={handleDelete}
            className="text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
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
      )}
    </div>
  );
};

export default TaskRow;

