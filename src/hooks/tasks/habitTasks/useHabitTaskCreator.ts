
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task, TaskType } from '@/types/tasks';
import { MetricType } from '@/types/habits/types';
import { HabitTaskOptions } from './types';

/**
 * Hook for creating habit-related tasks
 */
export const useHabitTaskCreator = () => {
  const createHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    date: string,
    duration: number = 1800, // Default 30 minutes
    options?: HabitTaskOptions
  ) => {
    console.log(`Creating task for habit ${habitId}, template ${templateId}`);
    
    // Determine task type based on metric type
    let taskType: TaskType = 'habit';
    
    if (options?.metricType === 'journal') {
      taskType = 'journal';
    } else if (options?.metricType === 'timer') {
      taskType = 'timer';
    } else if (options?.taskType) {
      taskType = options.taskType as TaskType;
    }
    
    const newTask: Task = {
      id: `habit-${habitId}-${date}`,
      name,
      description: `Task for habit on ${date}`,
      taskType,
      completed: false,
      duration,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId,
        templateId,
        date,
        metricType: options?.metricType
      }
    };
    
    // Emit event to create the task
    eventManager.emit('task:create', newTask);
    
    // Optionally select the task after creation
    if (options?.selectAfterCreate) {
      eventManager.emit('task:select', newTask.id);
    }
    
    return newTask.id;
  }, []);
  
  return {
    createHabitTask
  };
};
