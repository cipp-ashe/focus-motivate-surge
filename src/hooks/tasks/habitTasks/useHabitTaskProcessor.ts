
import { useCallback } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { HabitTaskEvent } from './types';

/**
 * Hook for processing habit tasks
 */
export const useHabitTaskProcessor = () => {
  /**
   * Process tasks for a specific habit
   */
  const processHabitTasks = useCallback((
    habitId: string,
    date: string,
    tasks: Task[]
  ) => {
    console.log(`Processing ${tasks.length} tasks for habit ${habitId} on ${date}`);
    
    // Find tasks for this habit and date
    const habitTasks = tasks.filter(task => {
      return task.relationships?.habitId === habitId && 
             task.relationships?.date === date;
    });
    
    return habitTasks;
  }, []);
  
  /**
   * Create a task for a habit
   */
  const createHabitTask = useCallback((
    habitId: string,
    name: string,
    duration: number,
    templateId: string,
    date: string
  ) => {
    console.log(`Creating habit task: ${name} for habit ${habitId}`);
    
    const task: Task = {
      id: `habit-${habitId}-${date}`,
      name,
      description: `Habit task for ${date}`,
      taskType: 'habit' as TaskType,
      duration,
      completed: false,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId,
        templateId,
        date
      }
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    return task.id;
  }, []);

  /**
   * Handle habit schedule events
   */
  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    console.log('Processing habit schedule event:', event);
    
    const { habitId, name, duration, templateId, date } = event;
    
    // Process the habit task
    const taskId = createHabitTask(habitId, name, duration, templateId, date);
    
    return taskId;
  }, [createHabitTask]);

  /**
   * Process any pending tasks
   */
  const processPendingTasks = useCallback(() => {
    console.log('Processing pending habit tasks');
    // Implementation would check for pending tasks and create them
  }, []);

  /**
   * Handler for habit completion events
   */
  const handleHabitComplete = useCallback((payload: any) => {
    const { habitId, date, value } = payload;
    console.log(`Handling habit completion for ${habitId} on ${date} with value:`, value);
    // Implementation would mark the corresponding task as completed
  }, []);
  
  return {
    processHabitTasks,
    createHabitTask,
    handleHabitSchedule,
    processPendingTasks,
    handleHabitComplete,
    processHabitTask: createHabitTask // Alias for backward compatibility with tests
  };
};
