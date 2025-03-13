
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
    
    const actionType = e.currentTarget.getAttribute('data-action-type');
    console.log("Task action:", actionType, "for task:", task.id);
    
    if (task.relationships?.habitId) {
      if (actionType === 'view-habit') {
        if (task.relationships?.habitId) {
          window.location.href = `/habits?habitId=${task.relationships.habitId}`;
        } else {
          toast.info(`Viewing habit task: ${task.name}`);
        }
        return;
      }
    }
    
    // Handle status changes via the dropdown
    if (actionType?.startsWith('status-')) {
      const newStatus = actionType.replace('status-', '') as 'pending' | 'in-progress' | 'completed' | 'dismissed';
      
      if (newStatus === 'completed') {
        // For completed status, use the task:complete event
        eventBus.emit('task:complete', { taskId: task.id });
        toast.success(`Task ${task.name} marked as complete`);
      } else if (newStatus === 'dismissed') {
        // For dismissed status, use the task:dismiss event if it's a habit task
        if (task.relationships?.habitId) {
          eventBus.emit('task:dismiss', { 
            taskId: task.id, 
            habitId: task.relationships.habitId,
            date: task.relationships.date || new Date().toDateString() 
          });
          toast.success(`Dismissed habit task: ${task.name}`);
        } else {
          // For regular tasks, just mark as dismissed
          eventBus.emit('task:update', { 
            taskId: task.id, 
            updates: { status: 'dismissed', dismissedAt: new Date().toISOString() } 
          });
          // Then move to completed
          setTimeout(() => {
            eventBus.emit('task:complete', { taskId: task.id });
          }, 100);
          toast.success(`Dismissed task: ${task.name}`);
        }
      } else {
        // For other statuses, just update the task
        eventBus.emit('task:update', { 
          taskId: task.id, 
          updates: { status: newStatus } 
        });
        toast.success(`Task ${task.name} marked as ${newStatus.replace('-', ' ')}`);
      }
      return;
    }
    
    // Legacy handling for toggle-progress action
    if (actionType === 'toggle-progress') {
      // Toggle between pending and in-progress
      const newStatus = task.status === 'in-progress' ? 'pending' : 'in-progress';
      eventBus.emit('task:update', { 
        taskId: task.id, 
        updates: { status: newStatus } 
      });
      
      toast.success(`Task ${task.name} marked as ${newStatus.replace('-', ' ')}`);
      return;
    }
    
    // Legacy handling for complete action
    if (actionType === 'complete') {
      eventBus.emit('task:complete', { taskId: task.id });
      toast.success(`Completed task: ${task.name}`);
      return;
    }
    
    // Process specific task types
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
        
        // Always dispatch event first to ensure UI is updated
        // This is critical for both new and existing journal entries
        window.dispatchEvent(new CustomEvent('open-journal', {
          detail: {
            taskId: task.id,
            taskName: task.name,
            entry: task.journalEntry || ''
          }
        }));
        
        // Then open the dialog if opener is provided
        if (onOpenTaskDialog) {
          console.log("Opening journal dialog for task:", task.id);
          onOpenTaskDialog();
        } else {
          console.error('No dialog opener provided for journal task:', task.id);
          toast.error('Unable to open journal editor');
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
          console.log(`Opening ${task.taskType} dialog for task:`, task.id);
          onOpenTaskDialog();
        } else {
          console.error(`No dialog opener provided for ${task.taskType} task:`, task.id);
          toast.error(`Unable to open ${task.taskType} editor`);
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
