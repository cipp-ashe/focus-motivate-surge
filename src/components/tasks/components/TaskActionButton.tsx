
import React from 'react';
import { Task } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Check, X, Edit, Clock, Image, FileText, List, Mic } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface TaskActionButtonProps {
  task: Task;
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => void;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({ 
  task, 
  onTaskAction,
  dialogOpeners
}) => {
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, actionType: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Call the parent handler for most actions
    onTaskAction(e, actionType);
    
    // Special handling for opening task-specific dialogs
    if (actionType === 'open') {
      console.log(`${task.taskType} button clicked for task: ${task.id}`);
      
      if (task.taskType === 'journal' && dialogOpeners?.journal) {
        dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
      } else if (task.taskType === 'checklist' && dialogOpeners?.checklist) {
        dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
      } else if (task.taskType === 'screenshot' && task.imageUrl && dialogOpeners?.screenshot) {
        dialogOpeners.screenshot(task.imageUrl, task.name);
      } else if (task.taskType === 'voicenote' && dialogOpeners?.voicenote) {
        dialogOpeners.voicenote(task.id, task.name);
      } else if (task.taskType === 'timer') {
        // For timer, we just trigger the action
        onTaskAction(e, 'true');
      } else {
        console.warn(`No dialog opener provided for ${task.taskType} task: ${task.id}`);
      }
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={(e) => handleButtonClick(e as any, 'open')}>
          {task.taskType === 'timer' && <Clock className="mr-2 h-4 w-4" />}
          {task.taskType === 'screenshot' && <Image className="mr-2 h-4 w-4" />}
          {task.taskType === 'journal' && <FileText className="mr-2 h-4 w-4" />}
          {task.taskType === 'checklist' && <List className="mr-2 h-4 w-4" />}
          {task.taskType === 'voicenote' && <Mic className="mr-2 h-4 w-4" />}
          {(!task.taskType || task.taskType === 'regular') && <Edit className="mr-2 h-4 w-4" />}
          Open {task.taskType || 'Task'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={(e) => handleButtonClick(e as any, 'complete')}
          className="text-green-600"
        >
          <Check className="mr-2 h-4 w-4" />
          Complete
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={(e) => handleButtonClick(e as any, 'dismiss')}
          className="text-amber-600"
        >
          <X className="mr-2 h-4 w-4" />
          Dismiss
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={(e) => handleButtonClick(e as any, 'delete')}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
