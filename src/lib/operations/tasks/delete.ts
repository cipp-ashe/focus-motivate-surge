
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { getTaskStorage } from '@/lib/storage/taskStorage';
import { canDeleteTask } from '@/lib/verification/taskVerification';

/**
 * Delete a task by ID
 * 
 * @param taskId The ID of the task to delete
 * @param options Optional settings for deletion behavior
 * @returns True if task was deleted, false if not
 */
export const deleteTask = (
  taskId: string,
  options: { 
    reason?: string;
    showToast?: boolean;
    verifyDependencies?: boolean;
  } = {}
): boolean => {
  const {
    reason = 'user-delete',
    showToast = true,
    verifyDependencies = true
  } = options;
  
  if (!taskId) {
    console.error('Cannot delete task: No taskId provided');
    return false;
  }
  
  try {
    // Get storage instance
    const storage = getTaskStorage();
    
    // Try to find the task
    const task = storage.findTaskById(taskId);
    if (!task) {
      console.warn(`Task with ID ${taskId} not found for deletion`);
      return false;
    }
    
    // Check if task can be deleted (no dependencies)
    if (verifyDependencies && !canDeleteTask(task)) {
      // Special case for habit tasks that need dismissal instead of deletion
      if (task.relationships?.habitId) {
        console.log(`Task ${taskId} is a habit task, dismissing instead of deleting`);
        
        // Dismiss the task using the habit:dismissed event
        if (task.relationships?.habitId && task.relationships?.date) {
          eventManager.emit('task:dismiss', {
            taskId: task.id,
            habitId: task.relationships.habitId,
            date: task.relationships.date
          });
          
          if (showToast) {
            toast.info('Habit task dismissed');
          }
          
          return true;
        }
      }
      
      if (showToast) {
        toast.error(`Cannot delete task with active dependencies`);
      }
      return false;
    }
    
    // Actually delete the task
    const deleted = storage.removeTask(taskId);
    
    if (deleted) {
      // Emit delete event with correct payload structure
      eventManager.emit('task:delete', {
        taskId,
        reason
      });
      
      if (showToast) {
        toast.success('Task deleted successfully');
      }
    }
    
    return deleted;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    if (showToast) {
      toast.error('Failed to delete task');
    }
    return false;
  }
};
