import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Task } from "../types/timer";

interface CompletedTasksProps {
  tasks: Task[];
  showCompleted: boolean;
  onToggleShow: () => void;
}

export const CompletedTasks = ({ 
  tasks, 
  showCompleted, 
  onToggleShow 
}: CompletedTasksProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        onClick={onToggleShow}
        className="w-full justify-between hover:bg-primary/20 border border-primary/20"
      >
        <span className="flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
          Completed Tasks
        </span>
        <span className="text-sm text-muted-foreground">
          {tasks.length}
        </span>
      </Button>
      
      {showCompleted && (
        <div className="space-y-2 pl-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="completed-task-enter completed-task-enter-active p-2 text-sm text-muted-foreground/90 line-through bg-muted/30 rounded-lg border border-primary/5 hover:bg-muted/40 transition-colors"
            >
              {task.name}
              {task.duration && (
                <span className="ml-2 text-xs text-muted-foreground/75">
                  ({task.duration}m)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};