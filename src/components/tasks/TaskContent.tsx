
import React from 'react';
import { Task } from "@/types/tasks";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { useTaskActionHandler } from "./components/TaskActionHandler";
import { TaskActionButton } from "./components/TaskActionButton";

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
  onOpenTaskDialog?: () => void; // Prop for opening task dialogs
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
  onOpenTaskDialog,
}) => {
  const durationInMinutes = Math.round(Number(task.duration || 1500) / 60);
  
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
    if (task.taskType === 'checklist' && action === 'true') {
      console.log('Dispatching open-checklist event directly');
      window.dispatchEvent(new CustomEvent('open-checklist', {
        detail: {
          taskId: task.id,
          taskName: task.name,
          items: task.checklistItems || []
        }
      }));
      return;
    }
    
    if (task.taskType === 'journal' && action === 'true') {
      console.log('Dispatching open-journal event directly');
      window.dispatchEvent(new CustomEvent('open-journal', {
        detail: {
          taskId: task.id,
          taskName: task.name,
          entry: task.journalEntry || ''
        }
      }));
      return;
    }
    
    if (task.taskType === 'voicenote' && action === 'true') {
      console.log('Dispatching open-voice-recorder event directly');
      window.dispatchEvent(new CustomEvent('open-voice-recorder', {
        detail: {
          taskId: task.id,
          taskName: task.name,
          voiceNoteUrl: task.voiceNoteUrl || ''
        }
      }));
      return;
    }
    
    if (task.taskType === 'screenshot' && action === 'true') {
      console.log('Dispatching show-image event directly');
      window.dispatchEvent(new CustomEvent('show-image', {
        detail: {
          taskId: task.id,
          taskName: task.name,
          imageUrl: task.imageUrl || ''
        }
      }));
      return;
    }
    
    if (task.taskType === 'timer' && action === 'true') {
      // For timer tasks, we need to update the status first
      if (task.status !== 'in-progress') {
        window.dispatchEvent(new CustomEvent('task-update', {
          detail: {
            taskId: task.id,
            updates: { status: 'in-progress' }
          }
        }));
      }
      
      // Then initialize the timer
      window.dispatchEvent(new CustomEvent('timer:init', {
        detail: {
          taskName: task.name,
          duration: task.duration || 1500
        }
      }));
      console.log(`Initialized timer for task: ${task.id}`);
      return;
    }
    
    // Use the task action handler for any other actions
    const { handleTaskAction } = useTaskActionHandler(task, onOpenTaskDialog);
    handleTaskAction(e, action);
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
  
  console.log("TaskContent rendering for task:", task.id, task.name, "type:", task.taskType, "onOpenTaskDialog available:", !!onOpenTaskDialog);
  
  return (
    <div className="p-4 relative">
      <div className="flex items-start justify-between gap-x-2">
        <div className="min-w-0 flex-1">
          <h3 className={cn(
            "text-base font-medium leading-6 text-primary",
            task.status === 'in-progress' && "text-amber-600",
            task.status === 'started' && "text-blue-600",
            task.status === 'delayed' && "text-orange-600"
          )}>
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
