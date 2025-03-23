
import { useCallback } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

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
      taskType: 'habit' as TaskType, // This should be a valid TaskType
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
  
  return {
    processHabitTasks,
    createHabitTask
  };
};
