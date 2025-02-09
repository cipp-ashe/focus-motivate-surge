import { Sparkles, X } from "lucide-react";
import { Task } from "@/types/tasks";

interface TaskHeaderProps {
  task: Task;
  onDelete: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

export const TaskHeader = ({ task, onDelete }: TaskHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-foreground line-clamp-1">{task.name}</span>
      </div>
      
      <button
        onClick={onDelete}
        onTouchStart={onDelete}
        className="text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
