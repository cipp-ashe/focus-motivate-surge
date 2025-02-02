import { Task } from "../TaskList";
import { Sparkles, Clock, X } from "lucide-react";
import { Input } from "../ui/input";

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  editingTaskId: string | null;
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
  onTaskDelete: (taskId: string) => void;
  onDurationChange: (taskId: string, newDuration: string) => void;
  onDurationClick: (e: React.MouseEvent | React.TouchEvent, taskId: string) => void;
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
  const preventPropagation = (e: React.MouseEvent | React.TouchEvent) => {
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
    if (value === '' || /^\d{1,2}$/.test(value)) {
      onDurationChange(task.id, value);
    }
  };

  return (
    <div
      className={`
        relative flex items-center justify-between
        p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm
        cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-accent/10 border-primary/40' 
          : 'hover:border-primary/30 hover:bg-accent/5'
        }
      `}
      onClick={(e) => onTaskClick(task, e)}
    >
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
              value={task.duration || 25}
              className="w-16 text-right bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={handleChange}
              onBlur={onInputBlur}
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
              {task.duration || 25}
            </span>
          )}
          <span className="text-muted-foreground">m</span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTaskDelete(task.id);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onTaskDelete(task.id);
          }}
          className="text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};