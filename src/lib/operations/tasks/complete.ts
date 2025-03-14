
import { toast } from "sonner";
import type { Task, TaskMetrics } from "@/types/tasks";
import type { TimerMetrics } from "@/types/metrics";
import { toISOString, getCurrentISOString } from "@/lib/utils/dateUtils";

interface CompleteTaskOptions {
  taskId: string;
  taskList: Task[];
  completedTasks: Task[];
  metrics?: TaskMetrics | TimerMetrics;
}

/**
 * Mark a task as completed and add it to the completed tasks list
 */
export function completeTask({ taskId, taskList, completedTasks, metrics }: CompleteTaskOptions): { 
  updatedTaskList: Task[]; 
  updatedCompletedTasks: Task[] 
} {
  try {
    // Find the task to complete
    const taskToComplete = taskList.find((task) => task.id === taskId);
    
    if (!taskToComplete) {
      toast.error("Task not found");
      return { updatedTaskList: taskList, updatedCompletedTasks: completedTasks };
    }
    
    console.log("Completing task with original metrics:", metrics);
    
    // Current timestamp as ISO string for default values
    const currentTimeIso = getCurrentISOString();
    
    // Prepare task metrics
    const formattedMetrics: TaskMetrics = {
      // Default values
      timeSpent: 0,
      timeElapsed: 0,
      pauseCount: 0,
      completionDate: currentTimeIso,
      
      // If we have metrics, use them
      ...(metrics ? {
        // Standard task metrics
        timeSpent: 'timeSpent' in metrics ? metrics.timeSpent : (metrics.actualDuration || 0),
        timeElapsed: 'timeElapsed' in metrics ? metrics.timeElapsed : (metrics.actualDuration || 0),
        pauseCount: metrics.pauseCount || 0,
        
        // Timer-specific metrics
        expectedTime: metrics.expectedTime || 0,
        actualDuration: metrics.actualDuration || 0,
        favoriteQuotes: Array.isArray(metrics.favoriteQuotes) ? metrics.favoriteQuotes : [],
        pausedTime: metrics.pausedTime || 0,
        extensionTime: metrics.extensionTime || 0,
        netEffectiveTime: metrics.netEffectiveTime || 0,
        efficiencyRatio: metrics.efficiencyRatio || 0,
        completionStatus: metrics.completionStatus || 'Completed',
        
        // Ensure completionDate is a properly formatted ISO string
        completionDate: toISOString(metrics.completionDate),
      } : {})
    };
    
    console.log("Completing task with formatted metrics:", formattedMetrics);
    
    // Create completed task
    const completedTask: Task = {
      ...taskToComplete,
      completed: true,
      completedAt: currentTimeIso,
      metrics: formattedMetrics
    };
    
    // Remove from active tasks, add to completed tasks
    const updatedTaskList = taskList.filter((task) => task.id !== taskId);
    const updatedCompletedTasks = [...completedTasks, completedTask];
    
    // Show toast notification
    toast.success(`Task "${taskToComplete.name}" completed`);
    
    return { updatedTaskList, updatedCompletedTasks };
  } catch (error) {
    console.error("Error in completeTask operation:", error);
    toast.error("Failed to complete task");
    return { updatedTaskList: taskList, updatedCompletedTasks: completedTasks };
  }
}

// Export the operations object
export const completeTaskOperations = {
  completeTask: (taskId: string, metrics?: TaskMetrics | TimerMetrics) => {
    // This function will be filled by the task reducer implementation
    // It's just a placeholder to conform to the expected API
    console.log(`Complete task operation called for ${taskId}`);
    return { taskId, metrics };
  }
};
