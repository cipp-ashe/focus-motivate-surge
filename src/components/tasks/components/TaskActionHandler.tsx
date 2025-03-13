
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { useCallback } from 'react';

export const useTaskActionHandler = (
  task: Task,
  onOpenTaskDialog?: () => void
) => {
  const handleTaskAction = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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
      case 'screenshot':
      case 'checklist':
      case 'voicenote':
        // Open the appropriate dialog
        if (onOpenTaskDialog) {
          onOpenTaskDialog();
        }
        break;
        
      default:
        eventBus.emit('task:complete', { taskId: task.id });
        toast.success(`Completed task: ${task.name}`);
        break;
    }
  }, [task, onOpenTaskDialog]);

  const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
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
  }, [task]);

  return { handleTaskAction, handleDelete };
};
