
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

/**
 * Operations related to updating tasks
 */
export const updateTaskOperations = {
  /**
   * Update an existing task with proper storage and event emission
   * @param taskId The ID of the task to update
   * @param updates The updates to apply to the task
   * @param options Additional options for task update
   */
  updateTask(
    taskId: string,
    updates: Partial<Task>,
    options: {
      suppressToast?: boolean;
      suppressEvent?: boolean;
    } = {}
  ): void {
    console.log(`TaskOperations: Updating task ${taskId}`, updates);
    
    try {
      // Skip if no valid updates
      if (!updates || Object.keys(updates).length === 0) {
        console.warn(`TaskOperations: No updates provided for task ${taskId}`);
        return;
      }
      
      // Get current task to ensure it exists
      const currentTask = taskStorage.getTaskById(taskId);
      if (!currentTask) {
        console.error(`Task ${taskId} not found for update`);
        return;
      }
      
      // Skip redundant updates (same status for example)
      if (updates.status && updates.status === currentTask.status) {
        console.log(`TaskOperations: Task ${taskId} already has status ${updates.status}, skipping update`);
        return;
      }
      
      // Update in storage first to ensure persistence
      taskStorage.updateTask(taskId, { ...currentTask, ...updates });
      
      // Emit task update event unless suppressed
      if (!options.suppressEvent) {
        eventManager.emit('task:update', { taskId, updates });
      }
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Updated task: ${currentTask.name}`);
      }
      
      // Force a UI refresh to ensure consistency
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 50);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  }
};
