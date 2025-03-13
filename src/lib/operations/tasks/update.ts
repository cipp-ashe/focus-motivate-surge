
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

// Track last update to prevent duplicate processing
const lastUpdates = new Map<string, {status: string, timestamp: number}>();

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
      
      // CRITICAL: Deduplicate status updates using the lastUpdates map
      if (updates.status) {
        const now = Date.now();
        const lastUpdate = lastUpdates.get(taskId);
        
        // Skip if we've processed this same status update within the last second
        if (lastUpdate && 
            lastUpdate.status === updates.status && 
            now - lastUpdate.timestamp < 1000) {
          console.log(`TaskOperations: Skipping duplicate status update for task ${taskId} (${updates.status}) - processed ${now - lastUpdate.timestamp}ms ago`);
          return;
        }
        
        // Skip if status hasn't changed
        if (updates.status === currentTask.status) {
          console.log(`TaskOperations: Task ${taskId} already has status ${updates.status}, skipping update`);
          return;
        }
        
        // Record this update to prevent duplicates
        lastUpdates.set(taskId, {status: updates.status, timestamp: now});
        
        // Clean up old entries from the Map every 10 seconds to prevent memory leaks
        if (lastUpdates.size > 100) {
          const cutoff = now - 10000; // 10 seconds ago
          for (const [key, value] of lastUpdates.entries()) {
            if (value.timestamp < cutoff) {
              lastUpdates.delete(key);
            }
          }
        }
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
        // IMPORTANT: Only emit the SPECIFIC changes that were requested
        // This helps prevent recursive loops where handlers try to 
        // re-apply the same changes
        eventManager.emit('task:update', { taskId, updates });
      }
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Updated task: ${currentTask.name}`);
      }
      
      // Use a custom event for UI refresh instead of task:update
      // This prevents event handlers from trying to update the task again
      window.dispatchEvent(new CustomEvent('force-ui-refresh', { detail: { taskId }}));
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
};
