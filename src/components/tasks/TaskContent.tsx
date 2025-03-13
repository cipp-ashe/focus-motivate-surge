
import React from 'react';
import { Task } from "@/types/tasks";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { useTaskActionHandler } from "./components/TaskActionHandler";
import { TaskActionButton } from "./components/TaskActionButton";
import { useNavigate } from 'react-router-dom';
import { TaskIcon } from './components/TaskIcon';

interface TaskContentProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TaskContent: React.FC<TaskContentProps> = ({
  task,
  editingTaskId,
  inputValue,
  onDelete,
  onDurationClick,
  onChange,
  onBlur,
  onKeyDown,
  preventPropagation,
  dialogOpeners,
}) => {
  const durationInMinutes = Math.round(Number(task.duration || 1500) / 60);
  const navigate = useNavigate();
  
  // Use the hook at the component level, not inside another function
  const { handleTaskAction: statusTaskAction } = useTaskActionHandler(task);
  
  // Handle the task action with direct event dispatching
  const handleTaskAction = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => {
    // Prevent event propagation
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Get the action type from the parameter or clicked element
    const action = actionType || 
      (e.currentTarget instanceof HTMLElement 
        ? e.currentTarget.getAttribute('data-action-type') 
        : null);
    
    console.log(`TaskContent: Action ${action} clicked for task ${task.id} of type ${task.taskType}`);
    
    // Handle task specific dialog opening based on task type
    if (task.taskType === 'checklist' && action === 'true' && dialogOpeners?.checklist) {
      console.log('Opening checklist via dialog opener');
      dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
      return;
    }
    
    if (task.taskType === 'journal' && action === 'true' && dialogOpeners?.journal) {
      console.log('Opening journal via dialog opener');
      dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
      return;
    }
    
    if (task.taskType === 'voicenote' && action === 'true' && dialogOpeners?.voicenote) {
      console.log('Opening voice recorder via dialog opener');
      dialogOpeners.voicenote(task.id, task.name);
      return;
    }
    
    if (task.taskType === 'screenshot' && action === 'true' && dialogOpeners?.screenshot) {
      console.log('Opening screenshot via dialog opener');
      dialogOpeners.screenshot(task.imageUrl || '', task.name);
      return;
    }
    
    // Only timer tasks should navigate to timer page
    if (task.taskType === 'timer' && action === 'true') {
      // Update task status if needed
      if (task.status !== 'in-progress') {
        window.dispatchEvent(new CustomEvent('task-update', {
          detail: {
            taskId: task.id,
            updates: { status: 'in-progress' }
          }
        }));
      }
      
      // Trigger timer:set-task event for the timer task
      window.dispatchEvent(new CustomEvent('timer:set-task', {
        detail: task
      }));
      
      // Navigate to the timer page
      navigate('/timer');
      
      console.log(`Navigating to timer page with timer task: ${task.id}`);
      return;
    }
    
    // Use the task action handler for any other actions
    statusTaskAction(e, action);
  };
  
  // Format the created date
  const createdDate = new Date(task.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  // Get status indicator for the task status
  const getStatusIndicator = () => {
    if (task.status === 'in-progress') {
      return {
        className: "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800",
        text: "In Progress"
      };
    } else if (task.status === 'started') {
      return {
        className: "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        text: "Started"
      };
    } else if (task.status === 'delayed') {
      return {
        className: "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800",
        text: "Delayed"
      };
    }
    return null;
  };
  
  const statusIndicator = getStatusIndicator();
  
  const onOpenTaskDialog = (task.taskType && dialogOpeners) ? () => {
    console.log(`Opening dialog for ${task.taskType} task:`, task.id);
    
    if (task.taskType === 'journal' && dialogOpeners.journal) {
      dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
    } else if (task.taskType === 'checklist' && dialogOpeners.checklist) {
      dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
    } else if (task.taskType === 'screenshot' && dialogOpeners.screenshot) {
      dialogOpeners.screenshot(task.imageUrl || '', task.name);
    } else if (task.taskType === 'voicenote' && dialogOpeners.voicenote) {
      dialogOpeners.voicenote(task.id, task.name);
    }
  } : undefined;
  
  console.log("TaskContent rendering for task:", task.id, task.name, "type:", task.taskType, "dialogOpeners available:", !!dialogOpeners);
  
  return (
    <div className="p-4 relative">
      <div className="flex items-start justify-between gap-x-2">
        <div className="min-w-0 flex-1">
          <h3 className={cn(
            "text-base font-medium leading-6 text-primary flex items-center gap-1",
            task.status === 'in-progress' && "text-amber-600",
            task.status === 'started' && "text-blue-600",
            task.status === 'delayed' && "text-orange-600"
          )}>
            <TaskIcon taskType={task.taskType} className="h-4 w-4 mr-1" />
            {task.name}
            
            {/* Status indicator (legacy visualization) */}
            {statusIndicator && (
              <span className={statusIndicator.className}>
                {statusIndicator.text}
              </span>
            )}
          </h3>
          
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {task.description || `Created ${timeAgo}`}
          </p>
        </div>
        
        <TaskActionButton
          task={task}
          editingTaskId={editingTaskId}
          inputValue={inputValue}
          durationInMinutes={durationInMinutes}
          onTaskAction={handleTaskAction}
          handleLocalChange={onChange}
          handleLocalBlur={onBlur}
          handleLocalKeyDown={onKeyDown}
          preventPropagation={preventPropagation}
          onOpenTaskDialog={onOpenTaskDialog}
        />
      </div>
    </div>
  );
};
