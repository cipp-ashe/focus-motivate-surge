
import { Sparkles, X } from "lucide-react";
import { Task } from "@/types/tasks";

interface TaskHeaderProps {
  task: Task;
  onDelete: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

export const TaskHeader = ({ task, onDelete }: TaskHeaderProps) => {
  return (
    <div className="flex items-center gap-3 flex-1">
      <Sparkles className="h-4 w-4 text-primary" />
      <span className="text-foreground line-clamp-1">{task.name}</span>
      
      <button
        onClick={onDelete}
        onTouchStart={onDelete}
        className="ml-auto text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

