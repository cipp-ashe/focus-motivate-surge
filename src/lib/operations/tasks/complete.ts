
import { Task } from "@/types/tasks";
import { eventManager } from "@/lib/events/EventManager";
import { logger } from "@/utils/logManager";
import { getCurrentISOString } from "@/lib/utils/dateUtils";

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
    
    // Emit the completion event
    eventManager.emit('task:complete', completedTask);
    
    return completedTask;
  } catch (error) {
    logger.error('TaskOperations', `Error completing task ${task.id}:`, error);
    throw error;
  }
};
