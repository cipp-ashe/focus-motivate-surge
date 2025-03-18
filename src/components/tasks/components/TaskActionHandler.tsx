
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';

export const useTaskActionHandler = (task: Task, onOpenTaskDialog?: () => void) => {
  // Handle task deletion
  const handleDelete = useCallback((e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    console.log("Deleting task:", task.id);
    
    // Emit deletion event with the correct payload structure
    eventManager.emit('task:delete', { taskId: task.id });
    
    // Show toast notification
    toast.success(`Task "${task.name}" deleted`);
  }, [task.id, task.name]);
  
  // Handle task action
  const handleTaskAction = useCallback((e: React.MouseEvent<Element>, actionType?: string) => {
    e.stopPropagation();
    console.log("Task action:", actionType, "for task:", task.id);
    
    if (!actionType) return;
    
    // Handle different action types
    switch (actionType) {
      case 'complete':
        eventManager.emit('task:complete', { taskId: task.id });
        toast.success(`Task "${task.name}" completed`);
        break;
        
      case 'dismiss':
        eventManager.emit('task:dismiss', { 
          taskId: task.id, 
          habitId: task.relationships?.habitId || 'none',
          date: task.relationships?.date || new Date().toISOString()
        });
        toast.info(`Task "${task.name}" dismissed`);
        break;
        
      case 'delete':
        eventManager.emit('task:delete', { taskId: task.id });
        toast.info(`Task "${task.name}" deleted`);
        break;
        
      case 'edit':
        if (onOpenTaskDialog) {
          onOpenTaskDialog();
        }
        break;
        
      case 'timer':
        eventManager.emit('timer:set-task', { 
          id: task.id, 
          name: task.name,
          duration: task.duration || 1500
        });
        toast.info(`Timer set for task: ${task.name}`);
        break;
        
      default:
        // For status changes
        if (actionType.startsWith('status-')) {
          const status = actionType.replace('status-', '');
          eventManager.emit('task:update', { 
            taskId: task.id, 
            updates: { status } 
          });
          toast.info(`Task "${task.name}" status changed to ${status}`);
        }
        // For specific task types, pass to parent component
        else if (onOpenTaskDialog) {
          onOpenTaskDialog();
        }
        break;
    }
  }, [task, onOpenTaskDialog]);
  
  return { handleDelete, handleTaskAction };
};
