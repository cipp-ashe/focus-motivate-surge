
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';

/**
 * Hook to process habit-related tasks
 */
export const useHabitTaskProcessor = () => {
  // Process a habit task
  const processHabitTask = useCallback((task: Task) => {
    console.log('Processing habit task:', task);
    return true;
  }, []);

  // Check if a task is a habit task
  const isHabitTask = useCallback((task: Task) => {
    return task.relationships?.habitId !== undefined;
  }, []);

  // Get all habit tasks
  const getHabitTasks = useCallback((tasks: Task[]) => {
    return tasks.filter(isHabitTask);
  }, [isHabitTask]);

  return {
    processHabitTask,
    isHabitTask,
    getHabitTasks
  };
};
