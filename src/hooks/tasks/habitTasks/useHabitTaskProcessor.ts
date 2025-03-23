
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';

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

  // Handle habit schedule event
  const handleHabitSchedule = useCallback((payload: {
    habitId: string;
    name: string;
    duration: number;
    templateId: string;
    date: string;
  }) => {
    console.log('Handling habit schedule:', payload);
    const task: Task = {
      id: uuidv4(),
      name: payload.name,
      taskType: 'habit',
      completed: false,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId: payload.habitId,
        templateId: payload.templateId
      }
    };
    
    // Emit task creation event
    eventManager.emit('task:create', task);
    
    return task;
  }, []);

  // Process pending habit tasks
  const processPendingTasks = useCallback(() => {
    console.log('Processing pending habit tasks');
    // Emit event to check pending tasks
    eventManager.emit('habit:check-pending', {});
  }, []);

  return {
    processHabitTask,
    isHabitTask,
    getHabitTasks,
    handleHabitSchedule,
    processPendingTasks
  };
};
