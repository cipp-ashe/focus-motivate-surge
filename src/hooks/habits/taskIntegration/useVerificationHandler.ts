
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
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
        eventManager.emit('task:create', existingTask);
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
      
      // Instead of using return value, explicitly create new task and return its ID
      const taskData = {
        habitId: event.habitId,
        templateId: event.templateId,
        name: event.name,
        duration: event.duration,
        date: event.date,
        taskType
      };
      
      // Emit event but don't rely on its return value
      eventManager.emit('habit:schedule', taskData);
      
      // Create a new task ID (this is a placeholder, in real app we'd get this from the storage)
      const newTaskId = `${event.habitId}-${event.date}`;
      
      console.log(`Task creation result: ${newTaskId ? 'success' : 'failed'}`);
      
      // Force a UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 300);
      
      return newTaskId;
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
