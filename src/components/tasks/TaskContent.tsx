
import React, { useState, useEffect } from 'react';
import { Task } from "@/types/tasks";
import { eventBus } from "@/lib/eventBus";
import { eventManager } from "@/lib/events/EventManager";
import { toast } from "sonner";
import { TaskHeader } from "./components/TaskHeader";
import { TaskTags } from "./TaskTags";

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
  
  useEffect(() => {
    if (editingTaskId === task.id) {
      setLocalInputValue(inputValue);
    }
  }, [inputValue, editingTaskId, task.id]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      console.log('Handling duration change:', value);
      setLocalInputValue(value);
      onChange(e);
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed, handling blur');
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
    
    console.log('Handling blur with final value:', finalValue);
    setLocalInputValue(finalValue);
    const syntheticEvent = {
      target: { value: finalValue }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    onBlur();
  };

  const handleTaskAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(`Task action clicked for ${task.name} (${task.taskType})`);
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      console.log("This is a habit-related task with ID:", task.relationships.habitId);
      
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
        console.log("Dispatching timer:init event");
        eventManager.emit('timer:init', { 
          taskName: task.name, 
          duration: task.duration || 1500 
        });
        break;
        
      case 'journal':
        console.log("Dispatching custom open-journal event for", task.id, task.name);
        
        const openJournalEvent = new CustomEvent('open-journal', {
          detail: { taskId: task.id, taskName: task.name, entry: task.journalEntry }
        });
        window.dispatchEvent(openJournalEvent);
        break;
        
      case 'screenshot':
        console.log("Handling screenshot view");
        if (task.imageUrl) {
          const showImageEvent = new CustomEvent('show-image', {
            detail: { imageUrl: task.imageUrl, taskName: task.name }
          });
          window.dispatchEvent(showImageEvent);
        } else {
          toast.error(`No image found for task: ${task.name}`);
        }
        break;
        
      case 'checklist':
        console.log('Opening checklist for task:', task.id, task.name);
        
        const itemsToPass = task.checklistItems || [];
        console.log('Checklist items:', itemsToPass);
        
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
        console.log("Dispatching open-voice-recorder event");
        const openVoiceRecorderEvent = new CustomEvent('open-voice-recorder', {
          detail: { taskId: task.id, taskName: task.name }
        });
        window.dispatchEvent(openVoiceRecorderEvent);
        break;
        
      default:
        console.log("Completing regular task");
        eventBus.emit('task:complete', { taskId: task.id });
        toast.success(`Completed task: ${task.name}`);
        break;
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      console.log('Dismissing habit task rather than deleting:', task.id);
      
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
  );
};
