
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { completeTaskOperations } from '@/lib/operations/tasks/complete';
import { deleteTaskOperations } from '@/lib/operations/tasks/delete';
import { updateTaskOperations } from '@/lib/operations/tasks/update';

export const useTaskActionHandler = (
  task: Task,
  onOpenTaskDialog?: () => void
) => {
  // This handler is primarily focused on status changes and task completion
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
      
      // Skip update if status is already the same (prevents infinite loops)
      if (task.status === newStatus) {
        console.log(`TaskActionHandler: Task ${task.id} already has status ${newStatus}, ignoring`);
        return;
      }
      
      console.log(`Changing task ${task.id} status from ${task.status} to: ${newStatus}`);
      
      try {
        if (newStatus === 'completed') {
          // For completed status, use completeTaskOperations to properly handle completion
          completeTaskOperations.completeTask(task.id);
          toast.success(`Task ${task.name} marked as complete`, { duration: 2000 });
        } else if (newStatus === 'dismissed') {
          // For dismissed status, use a specialized handler based on task type
          if (task.relationships?.habitId) {
            // Habit-related tasks need special dismissal
            deleteTaskOperations.deleteTask(task.id, {
              isDismissal: true,
              habitId: task.relationships.habitId,
              date: task.relationships.date || new Date().toDateString(),
              reason: 'dismissed'
            });
            toast.success(`Dismissed habit task: ${task.name}`, { duration: 2000 });
          } else {
            // For regular tasks, mark as dismissed
            updateTaskOperations.updateTask(task.id, { 
              status: 'dismissed', 
              dismissedAt: new Date().toISOString() 
            });
            
            // Then move to completed after a short delay
            setTimeout(() => {
              completeTaskOperations.completeTask(task.id);
            }, 100);
            toast.success(`Dismissed task: ${task.name}`, { duration: 2000 });
          }
        } else {
          // For other statuses, use proper task update operation
          console.log(`Using updateTaskOperations for ${task.id} with status ${newStatus}`);
          
          // Use direct storage operation to minimize event loops
          updateTaskOperations.updateTask(task.id, { status: newStatus }, { suppressToast: true });
          
          // Create a manual event with enough delay to prevent loops
          setTimeout(() => {
            // Force a UI refresh instead of another event
            window.dispatchEvent(new Event('force-task-update'));
          }, 50);
          
          toast.success(`Task ${task.name} marked as ${newStatus.replace('-', ' ')}`, { duration: 2000 });
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        toast.error(`Failed to update task status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      return; // Early return to ensure event doesn't propagate further
    }
    
    // Handle habit-related tasks
    if (task.relationships?.habitId && action === 'view-habit') {
      if (task.relationships?.habitId) {
        window.location.href = `/habits?habitId=${task.relationships.habitId}`;
      } else {
        toast.info(`Viewing habit task: ${task.name}`, { duration: 2000 });
      }
    }
    
    // Handle timer task selection
    if (action === 'true' && task.taskType === 'timer') {
      eventBus.emit('timer:set-task', task);
      toast.success(`Selected timer task: ${task.name}`, { duration: 2000 });
    }
    
    // Handle regular task completion (only for non-special task types)
    if (action === 'true' && !task.taskType) {
      completeTaskOperations.completeTask(task.id);
      toast.success(`Completed task: ${task.name}`, { duration: 2000 });
    }
  }, [task]);

  const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      // Use proper delete operation with dismissal flag for habit tasks
      deleteTaskOperations.deleteTask(task.id, {
        isDismissal: true,
        habitId: task.relationships.habitId,
        date: task.relationships.date || new Date().toDateString(),
        reason: 'dismissed'
      });
      
      toast.success(`Dismissed habit task for today: ${task.name}`, {
        description: "You won't see this habit task today",
        duration: 2000
      });
    } else {
      // Use direct delete operation for regular tasks
      deleteTaskOperations.deleteTask(task.id, {
        reason: 'manual'
      });
    }
  }, [task]);

  return { handleTaskAction, handleDelete };
};
