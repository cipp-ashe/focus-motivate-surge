
import React from 'react';
import { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, BookOpen, ImageIcon, CheckSquare, Mic, Zap } from "lucide-react";

interface TaskActionButtonProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  durationInMinutes: number;
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleLocalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocalBlur: () => void;
  handleLocalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({
  task,
  editingTaskId,
  inputValue,
  durationInMinutes,
  onTaskAction,
  handleLocalChange,
  handleLocalBlur,
  handleLocalKeyDown,
  preventPropagation,
}) => {
  // For habit-related tasks
  if (task.relationships?.habitId) {
    return (
      <div className="flex items-center gap-2">
        {getStandardActionButton()}
        <Button
          variant="outline"
          size="sm"
          onClick={onTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-500"
          data-action="true"
          data-action-type="view-habit"
        >
          <Zap className="h-3.5 w-3.5 text-green-500" />
          <span>View Habit</span>
        </Button>
      </div>
    );
  }
  
  return getStandardActionButton();

  function getStandardActionButton() {
    if (task.taskType === 'timer') {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10">
          <Clock className="h-3.5 w-3.5 text-primary opacity-70" />
          {editingTaskId === task.id ? (
            <Input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={inputValue}
              className="w-12 text-right bg-transparent border-0 focus:ring-0 p-0 h-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={handleLocalChange}
              onBlur={handleLocalBlur}
              onKeyDown={handleLocalKeyDown}
              autoFocus
              onClick={preventPropagation}
              onTouchStart={preventPropagation}
              data-action="true"
            />
          ) : (
            <span 
              className="w-8 text-right text-primary cursor-text"
              onClick={(e) => preventPropagation(e)}
              onTouchStart={(e) => preventPropagation(e)}
              data-action="true"
            >
              {durationInMinutes}
            </span>
          )}
          <span className="text-primary/70 text-sm">m</span>
        </Badge>
      );
    }
    
    if (task.taskType === 'journal') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <BookOpen className="h-3.5 w-3.5 text-amber-400" />
          <span>Write</span>
        </Button>
      );
    }
    
    if (task.taskType === 'screenshot') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
          <span>View</span>
        </Button>
      );
    }
    
    if (task.taskType === 'checklist') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
          <span>Checklist</span>
        </Button>
      );
    }
    
    if (task.taskType === 'voicenote') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <Mic className="h-3.5 w-3.5 text-rose-400" />
          <span>Record</span>
        </Button>
      );
    }
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onTaskAction}
        className="h-7 px-2 flex items-center gap-1 text-xs"
        data-action="true"
      >
        <CheckSquare className="h-3.5 w-3.5 text-green-500" />
        <span>Complete</span>
      </Button>
    );
  }
};
