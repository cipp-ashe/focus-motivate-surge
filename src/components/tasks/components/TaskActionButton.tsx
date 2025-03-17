
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { eventBus } from '@/lib/eventBus';

/**
 * Props for the TaskActionButton component
 * @interface TaskActionButtonProps
 */
interface TaskActionButtonProps {
  /** The task this action button is associated with */
  task: Task;
  /** Callback for task actions like complete, delete, dismiss */
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => void;
  /** Optional dialog openers for specific task types */
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  /** ID of the task currently being edited, if any */
  editingTaskId?: string | null;
  /** Current input value for the task being edited */
  inputValue?: string;
  /** Task duration in minutes */
  durationInMinutes?: number;
  /** Handler for local input changes */
  handleLocalChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handler for input blur events */
  handleLocalBlur?: () => void;
  /** Handler for key down events in the input */
  handleLocalKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Handler to prevent event propagation */
  preventPropagation?: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

/**
 * A dropdown menu button for task actions
 * 
 * This component provides a dropdown menu with various actions that can be performed
 * on a task, such as opening, completing, dismissing, or deleting the task.
 * It handles closing the dropdown after a selection and supports different actions
 * based on the task type.
 *
 * @param {TaskActionButtonProps} props - The component props
 * @returns {JSX.Element} The rendered dropdown menu
 */
export const TaskActionButton: React.FC<TaskActionButtonProps> = ({ 
  task, 
  onTaskAction,
  dialogOpeners,
  editingTaskId,
  inputValue,
  durationInMinutes,
  handleLocalChange,
  handleLocalBlur,
  handleLocalKeyDown,
  preventPropagation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, actionType: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Close dropdown immediately
    setIsOpen(false);
    
    // Special handling for timer tasks
    if ((task.taskType === 'timer' || task.taskType === 'focus') && (actionType === 'open' || actionType === 'timer')) {
      console.log(`Timer action triggered for task: ${task.id}`);
      
      // First navigate to the timer route if needed
      navigate('/timer');
      
      // Wait a small delay to ensure navigation happens before sending task
      setTimeout(() => {
        // Emit the event for timer to pick up the task
        eventBus.emit('timer:set-task', task);
        toast.success(`Timer set for: ${task.name}`);
      }, 100);
      
      return;
    }
    
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
      } else {
        console.warn(`No dialog opener provided for ${task.taskType} task: ${task.id}`);
      }
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Task actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-background/95 backdrop-blur-sm border-border/50">
        <DropdownMenuItem onClick={(e) => handleButtonClick(e as any, 'open')}>
          {(task.taskType === 'timer' || task.taskType === 'focus') && <Clock className="mr-2 h-4 w-4" />}
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
