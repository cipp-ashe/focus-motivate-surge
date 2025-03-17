import React from 'react';
import { Task } from '@/types/tasks';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { StatusDropdownMenu } from './components/buttons/StatusDropdownMenu';
import { eventBus } from '@/lib/eventBus';
import { JournalButton } from './components/buttons/JournalButton';
import { ChecklistButton } from './components/buttons/ChecklistButton';
import { TimerButton } from './components/buttons/TimerButton';
import { ScreenshotButton } from './components/buttons/ScreenshotButton';
import { VoiceNoteButton } from './components/VoiceNoteButton';
import { TaskActionButton } from './TaskActionButton';
import { TaskIcon } from './components/TaskIcon';
import { useNavigate } from 'react-router-dom';

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
  editingTaskId?: string | null;
  inputValue?: string;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
  onDurationClick?: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation?: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskContent: React.FC<TaskContentProps> = ({ 
  task, 
  isSelected = false, 
  onSelect,
  dialogOpeners,
  editingTaskId,
  inputValue,
  onDelete,
  onDurationClick,
  onChange,
  onBlur,
  onKeyDown,
  preventPropagation
}) => {
  const navigate = useNavigate();
  
  const handleTaskAction = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => {
    e.stopPropagation();
    console.log("TaskContent: Action", actionType, "clicked for task", task.id, "of type", task.taskType);
    
    if (!actionType) return;
    
    // Special handling for timer tasks
    if (task.taskType === 'timer' && actionType === 'timer') {
      console.log("Timer action from TaskContent for task:", task.id);
      
      // Navigate to timer page
      navigate('/timer');
      
      // After a small delay to ensure navigation happens
      setTimeout(() => {
        // Emit the timer event with task details
        eventBus.emit('timer:set-task', task);
        toast.success(`Timer set for: ${task.name}`);
      }, 100);
      
      return;
    }
    
    // Don't handle status change actions here anymore - StatusDropdownMenu emits events directly
    if (actionType.startsWith('status-')) {
      console.log("Task status change handled by StatusDropdownMenu directly");
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
      // Check if this is a habit task with relationships
      if (task.relationships?.habitId && task.relationships?.date) {
        eventBus.emit('task:dismiss', { 
          taskId: task.id, 
          habitId: task.relationships.habitId,
          date: task.relationships.date
        });
      } else {
        // For non-habit tasks, use default placeholders for required fields
        eventBus.emit('task:dismiss', { 
          taskId: task.id,
          habitId: 'none',
          date: new Date().toISOString()
        });
      }
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
    if (task.taskType === 'journal' && actionType === 'journal') {
      console.log("Opening journal for task:", task.id);
      if (dialogOpeners?.journal) {
        dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
      } else {
        console.warn("No dialog opener provided for journal task:", task.id);
      }
      return;
    }
    
    if (task.taskType === 'checklist' && actionType === 'checklist') {
      console.log("Opening checklist for task:", task.id);
      if (dialogOpeners?.checklist) {
        dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
      } else {
        console.warn("No dialog opener provided for checklist task:", task.id);
      }
      return;
    }
    
    if (task.taskType === 'timer' && actionType === 'true') {
      console.log("Setting timer task:", task.id);
      // Handle timer task action
      eventBus.emit('timer:set-task', task);
      return;
    }
    
    if (task.taskType === 'screenshot' && actionType === 'screenshot') {
      console.log("Opening screenshot for task:", task.id);
      if (dialogOpeners?.screenshot && task.imageUrl) {
        dialogOpeners.screenshot(task.imageUrl, task.name);
      } else {
        console.warn("No dialog opener provided for screenshot task or missing imageUrl:", task.id);
      }
      return;
    }
    
    if (task.taskType === 'voicenote' && actionType === 'voicenote') {
      console.log("Opening voice note for task:", task.id);
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
            <TaskIcon taskType={task.taskType} className="h-5 w-5" />
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
            editingTaskId={editingTaskId}
            inputValue={inputValue}
          />
        </div>
      </CardContent>
    </Card>
  );
};
