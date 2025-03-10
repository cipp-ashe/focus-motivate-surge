
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';

/**
 * Hook for creating habit-related tasks
 */
export const useHabitTaskCreator = () => {
  /**
   * Create a new task for a habit and emit events
   */
  const createHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    duration: number,
    date: string
  ): string | null => {
    if (!habitId || !name) {
      console.error('Invalid habit task parameters:', { habitId, name });
      return null;
    }
    
    try {
      // Generate task ID
      const taskId = uuidv4();
      
      // Create task object
      const task: Task = {
        id: taskId,
        name: name,
        description: `Habit task for ${date}`,
        completed: false,
        duration: duration,
        createdAt: new Date().toISOString(),
        relationships: {
          habitId: habitId,
          templateId: templateId,
          date: date
        }
      };
      
      console.log(`Creating habit task: ${taskId} for habit ${habitId}`, task);
      
      // Emit event to create task
      eventBus.emit('task:create', task);
      
      return taskId;
    } catch (error) {
      console.error('Error creating habit task:', error);
      return null;
    }
  }, []);
  
  return { createHabitTask };
};
