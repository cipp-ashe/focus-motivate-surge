
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';
import { toast } from 'sonner';

/**
 * Hook for verifying task existence and state
 */
export const useVerificationHandler = () => {
  /**
   * Verify task exists in storage and force UI update if needed
   */
  const verifyTaskExists = useCallback((habitId: string, date: string) => {
    try {
      // Check if task already exists
      const existingTask = taskStorage.taskExists(habitId, date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${habitId} on ${date}`);
        
        // Make sure the task is in memory too by emitting an event
        eventBus.emit('task:create', existingTask);
        return existingTask;
      }
      
      return null;
    } catch (error) {
      console.error('Error verifying task existence:', error);
      return null;
    }
  }, []);
  
  /**
   * Create a task for a habit from the event data
   */
  const createHabitTask = useCallback((
    event: {
      habitId: string;
      templateId: string;
      name: string;
      duration: number;
      date: string;
      metricType?: string;
    },
    taskType: string
  ) => {
    // Check if task already exists first
    const existingTask = verifyTaskExists(event.habitId, event.date);
    if (existingTask) {
      return existingTask;
    }
    
    try {
      console.log(`Creating new habit task for ${event.name} with type ${taskType}`);
      
      const taskId = eventBus.emit('habit:task-create', {
        habitId: event.habitId,
        templateId: event.templateId,
        name: event.name,
        duration: event.duration,
        date: event.date,
        taskType
      });
      
      console.log(`Task creation result: ${taskId ? 'success' : 'failed'}`);
      
      // Force a UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 300);
      
      return taskId;
    } catch (error) {
      console.error('Error creating habit task:', error);
      toast.error('Failed to create habit task');
      return null;
    }
  }, [verifyTaskExists]);
  
  return {
    verifyTaskExists,
    createHabitTask
  };
};
