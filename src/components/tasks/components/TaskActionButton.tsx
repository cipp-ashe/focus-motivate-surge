import React from 'react';
import { Task, TaskStatus } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, BookOpen, ImageIcon, CheckSquare, Mic, Zap, 
  ChevronDown, Square, Play, X, Check, AlertTriangle, ArrowRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionButtonProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  durationInMinutes: number;
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => void;
  handleLocalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocalBlur: () => void;
  handleLocalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onOpenTaskDialog?: () => void; // The dialog opener function
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
  onOpenTaskDialog, // Receive the dialog opener function
}) => {
  // For habit-related tasks
  if (task.relationships?.habitId) {
    return (
      <div className="flex items-center gap-2">
        {getStandardActionButton()}
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => onTaskAction(e, 'view-habit')}
          className="h-7 px-2 flex items-center gap-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-500"
        >
          <Zap className="h-3.5 w-3.5 text-green-500" />
          <span>View Habit</span>
        </Button>
        <StatusDropdownMenu task={task} onTaskAction={onTaskAction} />
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      {getStandardActionButton()}
      <StatusDropdownMenu task={task} onTaskAction={onTaskAction} />
    </div>
  );

  function StatusDropdownMenu({ task, onTaskAction }: { task: Task; onTaskAction: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => void }) {
    // Get status label and colors
    const getStatusInfo = (status: TaskStatus = 'pending') => {
      switch (status) {
        case 'pending':
          return { label: 'Not Started', icon: <Square className="h-3.5 w-3.5 mr-1" />, className: "bg-gray-500/10 hover:bg-gray-500/20 text-gray-500" };
        case 'started':
          return { label: 'Started', icon: <ArrowRight className="h-3.5 w-3.5 mr-1" />, className: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500" };
        case 'in-progress':
          return { label: 'In Progress', icon: <Play className="h-3.5 w-3.5 mr-1" />, className: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500" };
        case 'delayed':
          return { label: 'Delayed', icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />, className: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-500" };
        case 'completed':
          return { label: 'Complete', icon: <Check className="h-3.5 w-3.5 mr-1" />, className: "bg-green-500/10 hover:bg-green-500/20 text-green-500" };
        case 'dismissed':
          return { label: 'Dismissed', icon: <X className="h-3.5 w-3.5 mr-1" />, className: "bg-red-500/10 hover:bg-red-500/20 text-red-500" };
        default:
          return { label: 'Not Started', icon: <Square className="h-3.5 w-3.5 mr-1" />, className: "bg-gray-500/10 hover:bg-gray-500/20 text-gray-500" };
      }
    };

    const statusInfo = getStatusInfo(task.status);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-7 px-2 flex items-center gap-1 text-xs ${statusInfo.className}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 bg-background">
          <DropdownMenuItem
            onClick={(e) => onTaskAction(e, 'status-pending')}
            className="text-xs cursor-pointer"
          >
            <Square className="h-3.5 w-3.5 mr-2" />
            Not Started
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => onTaskAction(e, 'status-started')}
            className="text-xs cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5 mr-2" />
            Started
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => onTaskAction(e, 'status-in-progress')}
            className="text-xs cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 mr-2" />
            In Progress
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => onTaskAction(e, 'status-delayed')}
            className="text-xs cursor-pointer"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-2" />
            Delayed
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => onTaskAction(e, 'status-completed')}
            className="text-xs cursor-pointer text-green-600"
          >
            <Check className="h-3.5 w-3.5 mr-2" />
            Complete
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => onTaskAction(e, 'status-dismissed')}
            className="text-xs cursor-pointer text-red-500"
          >
            <X className="h-3.5 w-3.5 mr-2" />
            Dismissed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function getStandardActionButton() {
    if (task.taskType === 'timer') {
      return (
        <Badge 
          variant="outline" 
          className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10"
          onClick={(e) => {
            onTaskAction(e, 'true');
          }}
        >
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
          onClick={(e) => {
            console.log("Journal button clicked for task:", task.id);
            onTaskAction(e, 'true');
            
            if (onOpenTaskDialog) {
              console.log("Calling onOpenTaskDialog from journal button");
              onOpenTaskDialog();
            } else {
              console.warn("No dialog opener provided for journal task:", task.id);
            }
          }}
          className="h-7 px-2 flex items-center gap-1 text-xs"
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
          onClick={(e) => {
            console.log("Screenshot button clicked for task:", task.id);
            onTaskAction(e, 'true');
            
            if (onOpenTaskDialog) {
              console.log("Calling onOpenTaskDialog from screenshot button");
              onOpenTaskDialog();
            } else {
              console.warn("No dialog opener provided for screenshot task:", task.id);
            }
          }}
          className="h-7 px-2 flex items-center gap-1 text-xs"
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
          onClick={(e) => {
            console.log("Checklist button clicked for task:", task.id);
            onTaskAction(e, 'true');
            
            if (onOpenTaskDialog) {
              console.log("Calling onOpenTaskDialog from checklist button");
              onOpenTaskDialog();
            } else {
              console.warn("No dialog opener provided for checklist task:", task.id);
            }
          }}
          className="h-7 px-2 flex items-center gap-1 text-xs"
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
          onClick={(e) => {
            console.log("Voice note button clicked for task:", task.id);
            onTaskAction(e, 'true');
            
            if (onOpenTaskDialog) {
              console.log("Calling onOpenTaskDialog from voice note button");
              onOpenTaskDialog();
            } else {
              console.warn("No dialog opener provided for voice note task:", task.id);
            }
          }}
          className="h-7 px-2 flex items-center gap-1 text-xs"
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
