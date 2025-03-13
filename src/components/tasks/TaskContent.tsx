
import React from 'react';
import { Task } from '@/types/tasks';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon, TimerIcon, ImageIcon, PencilIcon, ClipboardListIcon, MicIcon } from 'lucide-react';
import { toast } from 'sonner';
import { StatusDropdownMenu } from './components/buttons/StatusDropdownMenu';
import { updateTaskOperations } from '@/lib/operations/tasks/update';
import { eventBus } from '@/lib/eventBus';
import { JournalButton } from './components/buttons/JournalButton';
import { ChecklistButton } from './components/buttons/ChecklistButton';
import { TimerButton } from './components/buttons/TimerButton';
import { ScreenshotButton } from './components/buttons/ScreenshotButton';
import { VoiceNoteButton } from './components/buttons/VoiceNoteButton';
import { TaskActionButton } from './components/TaskActionButton';

interface TaskContentProps {
  task: Task;
  isSelected?: boolean;
  onSelect?: () => void;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TaskContent: React.FC<TaskContentProps> = ({ 
  task, 
  isSelected = false, 
  onSelect,
  dialogOpeners
}) => {
  const handleTaskAction = (e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => {
    e.stopPropagation();
    console.log("TaskContent: Action", actionType, "clicked for task", task.id, "of type", task.taskType);
    
    if (!actionType) return;
    
    // Handle status change actions
    if (actionType.startsWith('status-')) {
      const newStatus = actionType.split('-')[1];
      console.log("Task status change:", newStatus, "for task:", task.id);
      
      updateTaskOperations.updateTaskStatus(task.id, newStatus as any);
      return;
    }
    
    // Handle task completion
    if (actionType === 'complete') {
      console.log("Task completion for task:", task.id);
      eventBus.emit('task:complete', { taskId: task.id });
      toast.success(`Completed task: ${task.name}`);
      return;
    }
    
    // Handle task dismissal
    if (actionType === 'dismiss') {
      console.log("Task dismissal for task:", task.id);
      eventBus.emit('task:dismiss', { taskId: task.id });
      toast.info(`Dismissed task: ${task.name}`);
      return;
    }
    
    // Handle task deletion
    if (actionType === 'delete') {
      console.log("Task deletion for task:", task.id);
      eventBus.emit('task:delete', { taskId: task.id });
      toast.info(`Deleted task: ${task.name}`);
      return;
    }
    
    // Special handling for each task type
    if (task.taskType === 'journal' && actionType === 'true') {
      console.log("Task action: true for task:", task.id, "type:", task.taskType);
      if (dialogOpeners?.journal) {
        dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
      } else {
        console.warn("No dialog opener provided for journal task:", task.id);
      }
      return;
    }
    
    if (task.taskType === 'checklist' && actionType === 'true') {
      console.log("Task action: true for task:", task.id, "type:", task.taskType);
      if (dialogOpeners?.checklist) {
        dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
      } else {
        console.warn("No dialog opener provided for checklist task:", task.id);
      }
      return;
    }
    
    if (task.taskType === 'timer' && actionType === 'true') {
      console.log("Task action: true for task:", task.id, "type:", task.taskType);
      // Handle timer task action
      eventBus.emit('timer:set-task', task);
      return;
    }
    
    if (task.taskType === 'screenshot' && actionType === 'true') {
      console.log("Task action: true for task:", task.id, "type:", task.taskType);
      if (dialogOpeners?.screenshot && task.imageUrl) {
        dialogOpeners.screenshot(task.imageUrl, task.name);
      } else {
        console.warn("No dialog opener provided for screenshot task or missing imageUrl:", task.id);
      }
      return;
    }
    
    if (task.taskType === 'voicenote' && actionType === 'true') {
      console.log("Task action: true for task:", task.id, "type:", task.taskType);
      if (dialogOpeners?.voicenote) {
        dialogOpeners.voicenote(task.id, task.name);
      } else {
        console.warn("No dialog opener provided for voicenote task:", task.id);
      }
      return;
    }
  };
  
  // Determine what type-specific button to show
  const renderTypeSpecificButton = () => {
    switch (task.taskType) {
      case 'journal':
        return (
          <JournalButton 
            task={task} 
            onTaskAction={handleTaskAction} 
          />
        );
      case 'checklist':
        return (
          <ChecklistButton 
            task={task} 
            onTaskAction={handleTaskAction} 
          />
        );
      case 'timer':
        return (
          <TimerButton 
            task={task} 
            onTaskAction={handleTaskAction} 
          />
        );
      case 'screenshot':
        return (
          <ScreenshotButton 
            task={task} 
            onTaskAction={handleTaskAction} 
          />
        );
      case 'voicenote':
        return (
          <VoiceNoteButton 
            task={task} 
            onTaskAction={handleTaskAction} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Card 
      className={`transition-all ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <div className="flex-shrink-0">
            {task.taskType === 'timer' && <TimerIcon className="h-5 w-5 text-blue-500" />}
            {task.taskType === 'screenshot' && <ImageIcon className="h-5 w-5 text-purple-500" />}
            {task.taskType === 'journal' && <PencilIcon className="h-5 w-5 text-green-500" />}
            {task.taskType === 'checklist' && <ClipboardListIcon className="h-5 w-5 text-amber-500" />}
            {task.taskType === 'voicenote' && <MicIcon className="h-5 w-5 text-red-500" />}
            {(!task.taskType || task.taskType === 'regular') && <CheckIcon className="h-5 w-5 text-gray-500" />}
          </div>
          
          <div className="truncate">
            <h3 className="font-medium leading-none truncate">{task.name}</h3>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{task.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusDropdownMenu task={task} onTaskAction={handleTaskAction} />
          
          {/* Type-specific action button */}
          {renderTypeSpecificButton()}
          
          {/* General task action button */}
          <TaskActionButton 
            task={task} 
            onTaskAction={handleTaskAction}
            dialogOpeners={dialogOpeners}
          />
        </div>
      </CardContent>
    </Card>
  );
};
