
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';
import { useCallback } from 'react';

export const useTaskActionHandler = (
  task: Task,
  onOpenTaskDialog?: () => void
) => {
  // This handler is now primarily focused on status changes and task completion,
  // not for opening dialogs (handled directly in TaskContent)
  const handleTaskAction = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => {
    // Ensure proper event handling
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Get the action type from the parameter or clicked element
    const action = actionType || 
      (e.currentTarget instanceof HTMLElement 
        ? e.currentTarget.getAttribute('data-action-type') 
        : null);
      
    console.log("Task action:", action, "for task:", task.id, "type:", task.taskType);
    
    // Handle status changes via the dropdown
    if (action?.startsWith('status-')) {
      const newStatus = action.replace('status-', '') as 'pending' | 'started' | 'in-progress' | 'delayed' | 'completed' | 'dismissed';
      console.log(`Changing task ${task.id} status to: ${newStatus}`);
      
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
    }
    
    // Handle habit-related tasks
    if (task.relationships?.habitId && action === 'view-habit') {
      if (task.relationships?.habitId) {
        window.location.href = `/habits?habitId=${task.relationships.habitId}`;
      } else {
        toast.info(`Viewing habit task: ${task.name}`);
      }
    }
    
    // Handle regular task completion (only for non-special task types)
    if (action === 'true' && !task.taskType) {
      eventBus.emit('task:complete', { taskId: task.id });
      toast.success(`Completed task: ${task.name}`);
    }
  }, [task]);

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
