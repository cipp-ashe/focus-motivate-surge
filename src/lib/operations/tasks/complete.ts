
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

/**
 * Operations related to completing tasks
 */
export const completeTaskOperations = {
  /**
   * Complete a task with proper storage and event emission
   * @param taskId The ID of the task to complete
   * @param metrics Optional metrics to save with the completed task
   * @param options Additional options for task completion
   */
  completeTask(
    taskId: string,
    metrics?: any,
    options: {
      suppressToast?: boolean;
    } = {}
  ): void {
    console.log(`TaskOperations: Completing task ${taskId}`, { metrics });
    
    try {
      // Get task before completing to show name in toast
      const task = taskStorage.getTaskById(taskId);
      if (!task) {
        console.warn(`Task ${taskId} not found for completion`);
        return;
      }
      
      // Update task to completed
      const completedTask = { ...task, completed: true };
      taskStorage.updateTask(taskId, completedTask);
      
      // Save completion metrics (this replaces moveToCompleted since we don't have that method)
      if (metrics) {
        // Store the completed task with its metrics in localStorage
        const completedTasks = JSON.parse(localStorage.getItem('completed_tasks') || '[]');
        completedTasks.push({...completedTask, completedAt: new Date().toISOString(), metrics});
        localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));
        
        // Remove from active tasks after storing in completed
        taskStorage.removeTask(taskId);
      }
      
      // Emit task complete event
      eventManager.emit('task:complete', { taskId, metrics });
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Completed task: ${task.name}`, { duration: 2000 });
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task', { duration: 2000 });
    }
  }
};
