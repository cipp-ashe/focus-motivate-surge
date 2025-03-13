
import React from 'react';
import { Task } from "@/types/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TaskIcon } from "./TaskIcon";
import { TaskActionButton } from "./TaskActionButton";

interface TaskHeaderProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => void;
  handleLocalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocalBlur: () => void;
  handleLocalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  editingTaskId,
  inputValue,
  onDelete,
  onTaskAction,
  handleLocalChange,
  handleLocalBlur,
  handleLocalKeyDown,
  preventPropagation,
}) => {
  const durationInMinutes = Math.round((task.duration || 1500) / 60);

  return (
    <div className="flex items-center justify-between w-full gap-3">
      <div className="flex items-center gap-3 flex-1">
        <div className="rounded-full bg-primary/10 p-1.5">
          <TaskIcon taskType={task.taskType} />
        </div>
        <span className="text-foreground line-clamp-1 flex-1 font-medium">
          {task.name}
          {task.relationships?.habitId && (
            <Badge variant="outline" className="ml-2 text-xs bg-green-500/10 text-green-500">
              Habit
            </Badge>
          )}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <TaskActionButton
          task={task}
          editingTaskId={editingTaskId}
          inputValue={inputValue}
          durationInMinutes={durationInMinutes}
          onTaskAction={onTaskAction}
          handleLocalChange={handleLocalChange}
          handleLocalBlur={handleLocalBlur}
          handleLocalKeyDown={handleLocalKeyDown}
          preventPropagation={preventPropagation}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          onTouchStart={onDelete}
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation hover:bg-destructive/10"
          data-action="true"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
