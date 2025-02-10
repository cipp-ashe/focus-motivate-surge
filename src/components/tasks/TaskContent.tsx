
import { Task } from "@/types/tasks";
import { Sparkles, X, Clock } from "lucide-react";
import { TaskTags } from "./TaskTags";
import { Input } from "../ui/input";

interface TaskContentProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskContent = ({
  task,
  editingTaskId,
  inputValue,
  onDelete,
  onDurationClick,
  onChange,
  onBlur,
  onKeyDown,
  preventPropagation,
}: TaskContentProps) => {
  const durationInMinutes = task.duration ? Math.round(task.duration / 60) : 25;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-foreground line-clamp-1 flex-1">{task.name}</span>
        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
        {editingTaskId === task.id ? (
          <Input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={inputValue}
            className="w-16 text-right bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoFocus
            onClick={preventPropagation}
            onTouchStart={preventPropagation}
          />
        ) : (
          <span 
            className="w-16 text-right text-muted-foreground cursor-text"
            onClick={onDurationClick}
            onTouchStart={onDurationClick}
          >
            {durationInMinutes}
          </span>
        )}
        <span className="text-muted-foreground shrink-0">m</span>
        <button
          onClick={onDelete}
          onTouchStart={onDelete}
          className="text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <TaskTags 
        task={task}
        preventPropagation={preventPropagation}
      />
    </div>
  );
};
