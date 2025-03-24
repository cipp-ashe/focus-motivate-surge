
import { useCallback } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { HabitTaskEvent } from '@/types/events/habit-events';
import { MetricType } from '@/types/habits/types';
import { useHabitTaskCreator } from './useHabitTaskCreator';

/**
 * Hook for processing habit tasks
 */
export const useHabitTaskProcessor = () => {
  const { createHabitTask } = useHabitTaskCreator();

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
   * Handle habit schedule events
   */
  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    console.log('Processing habit schedule event:', event);
    
    const { habitId, name, duration, templateId, date, metricType } = event;
    
    // Process the habit task with metric type
    const taskId = createHabitTask(
      habitId, 
      templateId, 
      name, 
      date, 
      duration,
      { metricType }
    );
    
    return taskId;
  }, [createHabitTask]);

  /**
   * Process any pending tasks
   */
  const processPendingTasks = useCallback(() => {
    console.log('Processing pending habit tasks');
    // Emit event to check pending habit tasks
    eventManager.emit('habits:check-pending', {});
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
    handleHabitSchedule,
    processPendingTasks,
    handleHabitComplete
  };
};
