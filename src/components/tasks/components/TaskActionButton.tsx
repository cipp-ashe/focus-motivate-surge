
import React from 'react';
import { Task } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Check, X, Trash, Clock, Edit, PlayCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface TaskActionButtonProps {
  task: Task;
  onTaskAction?: (e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => void;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({
  task,
  onTaskAction,
  dialogOpeners
}) => {
  if (!onTaskAction) return null;
  
  const showPlayButton = task.taskType === 'voicenote' && task.voiceNoteUrl;
  
  const handleAction = (e: React.MouseEvent<HTMLButtonElement>, actionType: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (onTaskAction) {
      onTaskAction(e, actionType);
    }
    
    // Handle special case for voice notes
    if (actionType === 'play-voicenote' && task.voiceNoteUrl) {
      const audio = new Audio(task.voiceNoteUrl);
      audio.play().catch(err => console.error('Failed to play voice note:', err));
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      {showPlayButton && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => handleAction(e, 'play-voicenote')}
        >
          <PlayCircle className="h-4 w-4" />
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={(e) => handleAction(e as any, 'edit')}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          
          {task.taskType === 'timer' && (
            <DropdownMenuItem onClick={(e) => handleAction(e as any, 'timer')}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Set Timer</span>
            </DropdownMenuItem>
          )}
          
          {task.taskType === 'checklist' && dialogOpeners?.checklist && (
            <DropdownMenuItem onClick={(e) => handleAction(e as any, 'checklist')}>
              <Check className="mr-2 h-4 w-4" />
              <span>Edit Checklist</span>
            </DropdownMenuItem>
          )}
          
          {task.taskType === 'journal' && dialogOpeners?.journal && (
            <DropdownMenuItem onClick={(e) => handleAction(e as any, 'journal')}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Journal</span>
            </DropdownMenuItem>
          )}
          
          {task.taskType === 'screenshot' && task.imageUrl && dialogOpeners?.screenshot && (
            <DropdownMenuItem onClick={(e) => handleAction(e as any, 'screenshot')}>
              <Edit className="mr-2 h-4 w-4" />
              <span>View Screenshot</span>
            </DropdownMenuItem>
          )}
          
          {task.taskType === 'voicenote' && dialogOpeners?.voicenote && (
            <DropdownMenuItem onClick={(e) => handleAction(e as any, 'voicenote')}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Voice Note</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={(e) => handleAction(e as any, 'complete')}>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            <span>Complete</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => handleAction(e as any, 'dismiss')}>
            <X className="mr-2 h-4 w-4 text-amber-500" />
            <span>Dismiss</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={(e) => handleAction(e as any, 'delete')}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
