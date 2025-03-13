
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
    
    // Handle marking task as in-progress
    if (e.currentTarget.getAttribute('data-action-type') === 'toggle-progress') {
      // Toggle between pending and in-progress
      const newStatus = task.status === 'in-progress' ? 'pending' : 'in-progress';
      eventBus.emit('task:update', { 
        taskId: task.id, 
        updates: { status: newStatus } 
      });
      
      toast.success(`Task ${task.name} marked as ${newStatus.replace('-', ' ')}`);
      return;
    }
    
    // Handle marking task as completed
    if (e.currentTarget.getAttribute('data-action-type') === 'complete') {
      eventBus.emit('task:complete', { taskId: task.id });
      toast.success(`Completed task: ${task.name}`);
      return;
    }
    
    switch(task.taskType) {
      case 'timer':
        // Set task to in-progress first
        if (task.status !== 'in-progress') {
          eventBus.emit('task:update', { 
            taskId: task.id, 
            updates: { status: 'in-progress' } 
          });
        }
        
        // Then initialize timer
        eventManager.emit('timer:init', { 
          taskName: task.name, 
          duration: task.duration || 1500 
        });
        break;
        
      case 'journal':
        // Mark as in-progress when opening journal
        if (task.status !== 'in-progress') {
          eventBus.emit('task:update', { 
            taskId: task.id, 
            updates: { status: 'in-progress' } 
          });
        }
        
        // If dialog opener is provided, use it to open the dialog
        if (onOpenTaskDialog) {
          // For existing entry, dispatch event first to ensure UI is updated
          window.dispatchEvent(new CustomEvent('open-journal', {
            detail: {
              taskId: task.id,
              taskName: task.name,
              entry: task.journalEntry || ''
            }
          }));
          onOpenTaskDialog();
        }
        break;
        
      case 'screenshot':
      case 'checklist':
      case 'voicenote':
        // Mark as in-progress when opening these task types
        if (task.status !== 'in-progress') {
          eventBus.emit('task:update', { 
            taskId: task.id, 
            updates: { status: 'in-progress' } 
          });
        }
        
        // Open the appropriate dialog
        if (onOpenTaskDialog) {
          onOpenTaskDialog();
        }
        break;
        
      default:
        // Regular tasks just get completed directly
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
