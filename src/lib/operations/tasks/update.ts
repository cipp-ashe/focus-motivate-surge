
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
      
      // Skip status update if status hasn't changed - this is critical to prevent infinite loops
      if (updates.status && updates.status === currentTask.status) {
        console.log(`TaskOperations: Task ${taskId} already has status ${updates.status}, skipping update`);
        return;
      }
      
      // Extra safeguard: Check entire update object for equivalence
      const hasChanges = Object.keys(updates).some(key => {
        return updates[key as keyof Partial<Task>] !== currentTask[key as keyof Task];
      });
      
      if (!hasChanges) {
        console.log(`TaskOperations: No actual changes in update for task ${taskId}, skipping update`);
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
        eventManager.emit('task:update', { taskId, updates });
      }
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Updated task: ${currentTask.name}`);
      }
      
      // IMPORTANT: Always dispatch a custom event for UI refresh - completely separate from data events
      // This ensures UI updates happen immediately even when the regular event is suppressed
      window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
        detail: { taskId, changes: updates } 
      }));
      
      // For status changes, also dispatch a simpler event for broader compatibility
      if (updates.status) {
        window.dispatchEvent(new Event('force-task-update'));
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
};
