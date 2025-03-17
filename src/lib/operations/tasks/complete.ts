
import { Task } from "@/types/tasks";
import { eventManager } from "@/lib/events/EventManager";
import { logger } from "@/utils/logManager";

// Helper function to get current ISO string
const getCurrentISOString = (): string => {
  return new Date().toISOString();
};

// Main completeTask function
export const completeTask = async (task: Task): Promise<Task> => {
  try {
    logger.info('TaskOperations', `Completing task: ${task.id} - ${task.name}`);
    
    // Create a completed version of the task
    const completedTask: Task = {
      ...task,
      completed: true,
      completedAt: getCurrentISOString(),
      status: 'completed'
    };
    
    // Emit the completion event with the taskId for correct typing
    eventManager.emit('task:complete', { 
      taskId: task.id,
      metrics: task.metrics
    });
    
    return completedTask;
  } catch (error) {
    logger.error('TaskOperations', `Error completing task ${task.id}:`, error);
    throw error;
  }
};

// Export as complete task operations
export const completeTaskOperations = {
  completeTask: (taskId: string) => {
    // Implementation logic to load task and call completeTask
    logger.info('TaskOperations', `Called completeTaskOperations.completeTask for task: ${taskId}`);
    
    // This would typically load the task from storage, but for now we just log
    // The actual implementation would interact with task storage
    eventManager.emit('task:complete', { taskId });
    
    return { success: true, taskId };
  }
};
