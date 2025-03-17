
import React, { useState } from 'react';
import { Task } from '@/types/tasks';
import {
  MoreVertical,
  Edit,
  Trash2,
  Check,
  XCircle,
  Copy,
  ListChecks,
  BookOpen,
  Timer,
  Image,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface TaskActionButtonProps {
  task: Task;
  onTaskAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, actionType?: string) => void;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  editingTaskId?: string | null;
  inputValue?: string;
}

export const TaskActionButton = ({
  task,
  onTaskAction,
  dialogOpeners,
  editingTaskId,
  inputValue
}: TaskActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuAction = (
    e: React.MouseEvent<HTMLDivElement>,
    actionType: string
  ) => {
    e.stopPropagation();
    setIsOpen(false);

    // Check if the event has a currentTarget
    if (e.currentTarget) {
      // Convert to a button event since the callback expects that
      const buttonEvent = e as unknown as React.MouseEvent<HTMLButtonElement>;
      if (onTaskAction) {
        onTaskAction(buttonEvent, actionType);
      }
    }
  };

  // Determine if additional actions should be shown based on task type
  const getSpecificActions = () => {
    const actions = [];
    
    if (task.taskType === 'checklist' && task.checklistItems?.length) {
      actions.push(
        <DropdownMenuItem 
          key="view-checklist" 
          onClick={(e) => handleMenuAction(e, 'checklist')}
        >
          <ListChecks className="w-4 h-4 mr-2" />
          View Checklist
        </DropdownMenuItem>
      );
    }
    
    if (task.taskType === 'journal' && task.journalEntry) {
      actions.push(
        <DropdownMenuItem 
          key="view-journal" 
          onClick={(e) => handleMenuAction(e, 'journal')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          View Journal
        </DropdownMenuItem>
      );
    }
    
    if (task.taskType === 'timer') {
      actions.push(
        <DropdownMenuItem 
          key="start-timer" 
          onClick={(e) => handleMenuAction(e, 'timer')}
        >
          <Timer className="w-4 h-4 mr-2" />
          Start Timer
        </DropdownMenuItem>
      );
    }
    
    if (task.taskType === 'screenshot' && task.imageUrl) {
      actions.push(
        <DropdownMenuItem 
          key="view-screenshot" 
          onClick={(e) => handleMenuAction(e, 'screenshot')}
        >
          <Image className="w-4 h-4 mr-2" />
          View Screenshot
        </DropdownMenuItem>
      );
    }
    
    if (task.taskType === 'voicenote' && task.voiceNoteUrl) {
      actions.push(
        <DropdownMenuItem 
          key="play-voicenote" 
          onClick={(e) => handleMenuAction(e, 'voicenote')}
        >
          <Mic className="w-4 h-4 mr-2" />
          Play Voice Note
        </DropdownMenuItem>
      );
    }
    
    return actions;
  };

  const specificActions = getSpecificActions();
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="h-8 w-8 p-0 rounded-full hover:bg-muted"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Standard actions */}
        <DropdownMenuItem onClick={(e) => handleMenuAction(e, 'edit')}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={(e) => handleMenuAction(e, 'duplicate')}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        
        {specificActions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {specificActions}
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Task status actions */}
        <DropdownMenuItem 
          onClick={(e) => handleMenuAction(e, 'complete')}
          className="text-green-600"
        >
          <Check className="w-4 h-4 mr-2" />
          Complete
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={(e) => handleMenuAction(e, 'dismiss')}
          className="text-amber-600"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Dismiss
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Destructive actions */}
        <DropdownMenuItem 
          onClick={(e) => handleMenuAction(e, 'delete')}
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
