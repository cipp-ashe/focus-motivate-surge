
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task, TaskType } from '@/types/tasks';

/**
 * Hook for creating habit-related tasks
 */
export const useHabitTaskCreator = () => {
  const createHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    date: string,
    duration: number = 1800 // Default 30 minutes
  ) => {
    console.log(`Creating task for habit ${habitId}, template ${templateId}`);
    
    const newTask: Task = {
      id: `habit-${habitId}-${date}`,
      name,
      description: `Task for habit on ${date}`,
      taskType: 'habit' as TaskType,
      completed: false,
      duration,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId,
        templateId,
        date
      }
    };
    
    // Emit event to create the task
    eventManager.emit('task:create', newTask);
    
    return newTask.id;
  }, []);
  
  return {
    createHabitTask
  };
};
