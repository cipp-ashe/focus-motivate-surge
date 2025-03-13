
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
        toast.error('Failed to update task: Task not found');
        return;
      }
      
      // IMPORTANT: Skip redundant updates (same status for example)
      // This is critical to prevent infinite loops
      if (updates.status && updates.status === currentTask.status) {
        console.log(`TaskOperations: Task ${taskId} already has status ${updates.status}, skipping update`);
        return;
      }
      
      // Create a complete updated task object to ensure all required fields
      const updatedTask = { ...currentTask, ...updates };
      
      // Add timestamps for status-specific updates
      if (updates.status === 'dismissed' && !updatedTask.dismissedAt) {
        updatedTask.dismissedAt = new Date().toISOString();
      } else if (updates.status === 'completed' && !updatedTask.completedAt) {
        updatedTask.completedAt = new Date().toISOString();
      }
      
      // Update in storage first to ensure persistence
      taskStorage.updateTask(taskId, updatedTask);
      
      // Emit task update event unless suppressed
      if (!options.suppressEvent) {
        // IMPORTANT: Only emit the SPECIFIC changes that were requested
        // This helps prevent recursive loops where handlers try to 
        // re-apply the same changes
        eventManager.emit('task:update', { taskId, updates });
      }
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Updated task: ${currentTask.name}`);
      }
      
      // Force a UI refresh to ensure consistency
      // Use a unique event name that won't conflict with other task events
      window.dispatchEvent(new CustomEvent('force-ui-refresh', { detail: { taskId }}));
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
};
