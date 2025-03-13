
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { Task, TaskMetrics } from '@/types/tasks';
import { TimerStateMetrics } from '@/types/metrics';

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
    metrics?: TaskMetrics | TimerStateMetrics,
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
      
      // Format metrics to ensure they're in the correct format
      const formattedMetrics: TaskMetrics = metrics ? {
        // Handle both Timer metrics and Task metrics
        timeSpent: metrics.actualDuration || metrics.timeSpent || 0,
        timeElapsed: metrics.actualDuration || 0,
        pauseCount: metrics.pauseCount || 0,
        completionDate: new Date().toISOString(),
        expectedTime: metrics.expectedTime || 0,
        actualDuration: metrics.actualDuration || 0,
        
        // Ensure favoriteQuotes is properly handled
        favoriteQuotes: Array.isArray(metrics.favoriteQuotes) 
          ? metrics.favoriteQuotes 
          : [],
          
        pausedTime: metrics.pausedTime || 0,
        extensionTime: metrics.extensionTime || 0,
        netEffectiveTime: metrics.netEffectiveTime || 0,
        efficiencyRatio: metrics.efficiencyRatio || 0,
        completionStatus: metrics.completionStatus || 'Completed',
      } : {
        timeSpent: 0,
        timeElapsed: 0,
        pauseCount: 0,
        completionDate: new Date().toISOString(),
        expectedTime: 0,
        actualDuration: 0,
        favoriteQuotes: [],
        pausedTime: 0,
        extensionTime: 0,
        netEffectiveTime: 0,
        efficiencyRatio: 0,
        completionStatus: 'Completed',
      };
      
      // Update task to completed
      const completedTask: Task = { 
        ...task, 
        completed: true,
        completedAt: new Date().toISOString(),
        metrics: formattedMetrics
      };
      
      console.log("TaskOperations: Completed task with metrics:", completedTask);
      
      // Save completion metrics
      // Store the completed task with its metrics in localStorage
      const completedTasks = JSON.parse(localStorage.getItem('completed_tasks') || '[]');
      completedTasks.push(completedTask);
      localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));
      
      // Update the task in the active task list
      taskStorage.updateTask(taskId, completedTask);
      
      // Remove from active tasks after storing in completed
      taskStorage.removeTask(taskId);
      
      // Emit task complete event with formatted metrics
      eventManager.emit('task:complete', { taskId, metrics: formattedMetrics });
      
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
