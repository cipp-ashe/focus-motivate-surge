
import React from 'react';
import { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, BookOpen, ImageIcon, CheckSquare, Mic, Zap, Edit, Eye, 
  PlayCircle, PauseCircle, CheckCircle 
} from "lucide-react";

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
  
  return (
    <div className="flex items-center gap-2">
      {getStandardActionButton()}
      
      {/* Progress toggle button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onTaskAction}
        className={`h-7 px-2 flex items-center gap-1 text-xs ${
          task.status === 'in-progress' 
            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500' 
            : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500'
        }`}
        data-action="true"
        data-action-type="toggle-progress"
      >
        {task.status === 'in-progress' ? (
          <>
            <PauseCircle className="h-3.5 w-3.5" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <PlayCircle className="h-3.5 w-3.5" />
            <span>Start</span>
          </>
        )}
      </Button>
      
      {/* Complete button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onTaskAction}
        className="h-7 px-2 flex items-center gap-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-500"
        data-action="true"
        data-action-type="complete"
      >
        <CheckCircle className="h-3.5 w-3.5" />
        <span>Complete</span>
      </Button>
    </div>
  );

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
          <span>{task.journalEntry ? 'View' : 'Write'}</span>
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
          <span>{task.imageUrl ? 'View' : 'Add'}</span>
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
          <span>{task.checklistItems?.length ? 'View' : 'Create'} Checklist</span>
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
          <span>{task.voiceNoteUrl ? 'Listen' : 'Record'}</span>
        </Button>
      );
    }
    
    // If there's a specific action type, we don't need a default button
    return null;
  }
};
