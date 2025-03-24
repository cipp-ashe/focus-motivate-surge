
import { useCallback } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { HabitTaskEvent } from './types';
import { MetricType } from '@/components/habits/types';

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
   * Create a task for a habit based on its metric type
   */
  const createHabitTask = useCallback((
    habitId: string,
    name: string,
    duration: number,
    templateId: string,
    date: string,
    metricType: MetricType = 'boolean'
  ) => {
    console.log(`Creating habit task: ${name} for habit ${habitId} with metric type: ${metricType}`);
    
    // Determine task type based on metric type
    let taskType: TaskType = 'habit';
    
    if (metricType === 'journal') {
      taskType = 'journal';
    } else if (metricType === 'timer') {
      taskType = 'timer';
    }
    
    const task: Task = {
      id: `habit-${habitId}-${date}`,
      name,
      description: `Habit task for ${date}`,
      taskType,
      duration,
      completed: false,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId,
        templateId,
        date,
        metricType
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
    
    const { habitId, name, duration, templateId, date, metricType } = event;
    
    // Process the habit task with metric type
    const taskId = createHabitTask(
      habitId, 
      name, 
      duration, 
      templateId, 
      date, 
      metricType || 'boolean'
    );
    
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
    const { habitId, date, value, metricType, habitName, templateId } = payload;
    console.log(`Handling habit completion for ${habitId} on ${date} with value:`, value);
    
    // For journal habit completion, we need special handling
    if (metricType === 'journal') {
      // Emit journal open event
      eventManager.emit('journal:open', {
        habitId,
        habitName: habitName || 'Journal Entry',
        date,
        templateId
      });
    }
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
