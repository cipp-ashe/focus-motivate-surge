
import React, { useState, useEffect } from 'react';
import { Task } from "@/types/tasks";
import { eventBus } from "@/lib/eventBus";
import { eventManager } from "@/lib/events/EventManager";
import { toast } from "sonner";
import { TaskHeader } from "./components/TaskHeader";
import { TaskTags } from "./TaskTags";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScreenshotContent } from "@/components/screenshots/components/ScreenshotContent";

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
}

export const TaskContent = ({
  task,
  editingTaskId,
  inputValue,
  onDelete,
  onDurationClick,
  onChange,
  onBlur,
  onKeyDown,
  preventPropagation,
}: TaskContentProps) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
  const [isScreenshotExpanded, setIsScreenshotExpanded] = useState(true);
  
  useEffect(() => {
    if (editingTaskId === task.id) {
      setLocalInputValue(inputValue);
    }
  }, [inputValue, editingTaskId, task.id]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setLocalInputValue(value);
      onChange(e);
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    onKeyDown(e);
  };

  const handleLocalBlur = () => {
    let finalValue = localInputValue;
    if (finalValue === '' || isNaN(parseInt(finalValue, 10))) {
      finalValue = '25';
    } else {
      const numValue = parseInt(finalValue, 10);
      finalValue = Math.min(Math.max(numValue, 1), 60).toString();
    }
    
    setLocalInputValue(finalValue);
    const syntheticEvent = {
      target: { value: finalValue }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    onBlur();
  };

  const handleTaskAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      if (e.currentTarget.getAttribute('data-action-type') === 'view-habit') {
        if (task.relationships?.habitId) {
          window.location.href = `/habits?habitId=${task.relationships.habitId}`;
        } else {
          toast.info(`Viewing habit task: ${task.name}`);
        }
        return;
      }
    }
    
    switch(task.taskType) {
      case 'timer':
        eventManager.emit('timer:init', { 
          taskName: task.name, 
          duration: task.duration || 1500 
        });
        break;
        
      case 'journal':
        const openJournalEvent = new CustomEvent('open-journal', {
          detail: { taskId: task.id, taskName: task.name, entry: task.journalEntry }
        });
        window.dispatchEvent(openJournalEvent);
        break;
        
      case 'screenshot':
        if (task.imageUrl) {
          // Open dialog instead of dispatching an event
          setIsScreenshotDialogOpen(true);
        } else {
          toast.error(`No image found for task: ${task.name}`);
        }
        break;
        
      case 'checklist':
        const itemsToPass = task.checklistItems || [];
        
        const openChecklistEvent = new CustomEvent('open-checklist', {
          detail: { 
            taskId: task.id, 
            taskName: task.name, 
            items: itemsToPass
          }
        });
        window.dispatchEvent(openChecklistEvent);
        break;
        
      case 'voicenote':
        const openVoiceRecorderEvent = new CustomEvent('open-voice-recorder', {
          detail: { taskId: task.id, taskName: task.name }
        });
        window.dispatchEvent(openVoiceRecorderEvent);
        break;
        
      default:
        eventBus.emit('task:complete', { taskId: task.id });
        toast.success(`Completed task: ${task.name}`);
        break;
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      eventBus.emit('task:dismiss', { 
        taskId: task.id, 
        habitId: task.relationships.habitId,
        date: task.relationships.date || new Date().toDateString() 
      });
      
      toast.success(`Dismissed habit task for today: ${task.name}`, {
        description: "You won't see this habit task today"
      });
    } else {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4">
        <TaskHeader 
          task={task}
          editingTaskId={editingTaskId}
          inputValue={localInputValue}
          onDelete={handleDelete}
          onTaskAction={handleTaskAction}
          handleLocalChange={handleLocalChange}
          handleLocalBlur={handleLocalBlur}
          handleLocalKeyDown={handleLocalKeyDown}
          preventPropagation={preventPropagation}
        />

        {task.tags && (
          <TaskTags 
            tags={task.tags}
            preventPropagation={preventPropagation}
          />
        )}
      </div>

      {/* Screenshot Dialog */}
      {task.taskType === 'screenshot' && (
        <Dialog open={isScreenshotDialogOpen} onOpenChange={setIsScreenshotDialogOpen}>
          <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{task.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-2">
              <ScreenshotContent 
                task={task}
                isExpanded={isScreenshotExpanded}
                setIsExpanded={setIsScreenshotExpanded}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
