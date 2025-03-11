
import { taskStorage } from '@/lib/storage/taskStorage';
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
      
      // Remove from storage first to ensure persistence
      taskStorage.removeTask(taskId);
      
      // Emit task deletion event
      eventManager.emit('task:delete', { 
        taskId, 
        reason: options.reason || 'user-action',
        suppressToast: options.suppressToast 
      });
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Deleted task: ${task.name}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  }
};
