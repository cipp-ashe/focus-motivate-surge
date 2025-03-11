
import { taskStorage } from '@/lib/storage/task';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

/**
 * Operations related to deleting tasks
 */
export const deleteTaskOperations = {
  /**
   * Delete a task with proper storage and event emission
   * @param taskId The ID of the task to delete
   * @param options Additional options for task deletion
   */
  deleteTask(
    taskId: string,
    options: {
      reason?: string;
      suppressToast?: boolean;
      isDismissal?: boolean;
      habitId?: string;
      date?: string;
    } = {}
  ): void {
    console.log(`TaskOperations: Deleting task ${taskId}`, options);
    
    try {
      // Get task before deleting to show name in toast
      const task = taskStorage.getTaskById(taskId);
      
      if (!task) {
        console.warn(`Task ${taskId} not found for deletion`);
        return;
      }
      
      // If this is a dismissal (habit task being skipped for today)
      if (options.isDismissal && task.relationships?.habitId && task.relationships?.date) {
        console.log(`TaskOperations: Dismissing habit task ${taskId} for ${task.relationships.habitId} on ${task.relationships.date}`);
        
        // Create a dismissal event with all required data
        eventManager.emit('task:dismiss', { 
          taskId,
          habitId: task.relationships.habitId, 
          date: task.relationships.date
        });
        
        // Show toast for dismissal
        if (!options.suppressToast) {
          toast.success(`Dismissed task: ${task.name}`);
        }
        
        // We'll let the task:dismiss event handler actually remove the task
        return;
      }
      
      // Regular task deletion - remove from active storage
      taskStorage.removeTask(taskId);
      console.log(`TaskOperations: Removed active task ${taskId}`);
      
      // Emit task deletion event
      eventManager.emit('task:delete', { 
        taskId, 
        reason: options.reason || 'user-action',
        suppressToast: options.suppressToast 
      });
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Deleted task${task ? ': ' + task.name : ''}`);
      }
      
      // Force UI refresh
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 100);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  }
};
