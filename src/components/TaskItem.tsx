import { Sparkles } from "lucide-react";
import { Task } from "../types/timer";

interface TaskItemProps {
  task: Task;
  onSelect: (task: Task) => void;
}

export const TaskItem = ({ task, onSelect }: TaskItemProps) => (
  <div
    onClick={() => onSelect(task)}
    className="task-list-item p-3 rounded-lg bg-background/50 hover:bg-primary/20 cursor-pointer transition-all duration-300 border border-primary/20"
  >
    <div className="flex items-center gap-2">
      <Sparkles className="h-4 w-4 text-primary" />
      <span>{task.name}</span>
      {task.duration && (
        <span className="ml-auto text-sm text-muted-foreground">
          {task.duration}m
        </span>
      )}
    </div>
  </div>
);