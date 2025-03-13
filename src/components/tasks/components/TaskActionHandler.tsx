
import { Task } from '@/types/tasks';
import { useCallback } from 'react';
import { completeTaskOperations } from '@/lib/operations/tasks/complete';
import { deleteTaskOperations } from '@/lib/operations/tasks/delete';
import { updateTaskOperations } from '@/lib/operations/tasks/update';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';

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
    
    // No action specified
    if (!action) {
      return;
    }
    
    // Handle status changes via the dropdown
    if (action?.startsWith('status-')) {
      const newStatus = action.replace('status-', '') as 'pending' | 'started' | 'in-progress' | 'delayed' | 'completed' | 'dismissed';
      
      // Skip update if status is already the same
      if (task.status === newStatus) {
        console.log(`TaskActionHandler: Task ${task.id} already has status ${newStatus}, ignoring`);
        return;
      }
      
      console.log(`Changing task ${task.id} status from ${task.status} to: ${newStatus}`);
      
      try {
        if (newStatus === 'completed') {
          // For completed status, use completeTaskOperations to properly handle completion
          completeTaskOperations.completeTask(task.id);
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
          } else {
            // For regular tasks, update with required dismissed fields
            updateTaskOperations.updateTask(task.id, { 
              status: 'dismissed', 
              dismissedAt: new Date().toISOString() 
            }, { suppressEvent: true });
          }
        } else {
          // For other statuses, use the update operations directly
          // Set suppressEvent to true to prevent event loops - UI will update via custom event
          updateTaskOperations.updateTask(task.id, { status: newStatus }, { suppressEvent: true });
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
    }
  }, [task]);

  const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Simply use the delete operation without any ref-based tracking
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
