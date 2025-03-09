
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { useTaskEvents } from '../useTaskEvents';

/**
 * Hook to check existence of tasks in memory and localStorage
 */
export const useTaskVerification = (tasks: Task[]) => {
  const { forceTaskUpdate } = useTaskEvents();
  
  /**
   * Check if a habit task exists in the current memory tasks
   */
  const checkTaskExistsInMemory = useCallback((habitId: string, date: string) => {
    return tasks.find(task => 
      task.relationships?.habitId === habitId && 
      task.relationships?.date === date
    );
  }, [tasks]);
  
  /**
   * Check if a habit task exists in localStorage
   */
  const checkTaskExistsInStorage = useCallback((habitId: string, date: string) => {
    // Check localStorage directly
    const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    const existingTask = storedTasks.find((task: Task) => 
      task.relationships?.habitId === habitId && 
      task.relationships?.date === date
    );
    
    if (existingTask) {
      // Force a task update to ensure the task is loaded
      setTimeout(() => forceTaskUpdate(), 100);
    }
    
    return existingTask;
  }, [forceTaskUpdate]);
  
  return {
    checkTaskExistsInMemory,
    checkTaskExistsInStorage
  };
};
