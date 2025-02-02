import { Sparkles, X, Clock } from "lucide-react";
import { Task } from "../types/timer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  onSelect: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateDuration: (taskId: string, duration: number) => void;
}

export const TaskItem = ({ task, onSelect, onDelete, onUpdateDuration }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [duration, setDuration] = useState(task.duration?.toString() || "25");

  const handleDurationChange = (value: string) => {
    const newDuration = parseInt(value);
    if (newDuration >= 1 && newDuration <= 60) {
      setDuration(value);
      onUpdateDuration(task.id, newDuration);
      setIsEditing(false);
      toast(`Updated duration for "${task.name}" to ${newDuration} minutes`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
      handleDurationChange(duration);
    }
  };

  return (
    <div
      className="task-list-item p-3 rounded-lg bg-background/50 hover:bg-primary/20 cursor-pointer transition-all duration-300 border border-primary/20"
      onClick={() => !isEditing && onSelect(task)}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{task.name}</span>
          </div>
        </div>
        
        <div 
          className="flex items-center gap-2" 
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onBlur={() => handleDurationChange(duration)}
              onKeyDown={handleKeyDown}
              className="w-16 h-8 text-sm"
              min={1}
              max={60}
              autoFocus
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:bg-primary/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm text-muted-foreground">
                {task.duration}m
              </span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
              toast(`Removed task "${task.name}"`);
            }}
            className="h-8 w-8 p-0 hover:bg-destructive/20"
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
};