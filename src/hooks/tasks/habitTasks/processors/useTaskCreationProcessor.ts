
import { useCallback, useRef } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { useTaskTypeProcessor } from './useTaskTypeProcessor';

/**
 * Hook for processing habit task creation with debouncing
 */
export const useTaskCreationProcessor = (createHabitTask: (
  habitId: string,
  templateId: string,
  name: string,
  duration: number,
  date: string,
  taskType: TaskType
) => string | null) => {
  const { determineTaskType, isValidTaskType } = useTaskTypeProcessor();
  const processingRef = useRef<Record<string, boolean>>({});
  const processingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  /**
   * Process a single habit task event with debouncing and error handling
   */
  const processHabitTask = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    taskType?: TaskType;
    metricType?: string;
  }) => {
    console.log(`Processing habit task schedule:`, event);
    
    // Generate a unique processing key for this habit-date combination
    const processingKey = `${event.habitId}-${event.date}`;
    
    // If we're already processing this exact habit-date combination, debounce
    if (processingRef.current[processingKey]) {
      console.log(`Already processing task for habit ${event.habitId} on ${event.date}, debouncing`);
      
      // Clear existing timeout if any
      if (processingTimeoutsRef.current[processingKey]) {
        clearTimeout(processingTimeoutsRef.current[processingKey]);
      }
      
      // Set new timeout to retry after a delay
      processingTimeoutsRef.current[processingKey] = setTimeout(() => {
        processHabitTask(event);
      }, 300);
      
      return;
    }
    
    // Mark as processing to prevent duplicates
    processingRef.current[processingKey] = true;
    
    try {
      // Check if task already exists using storage service
      const existingTask = taskStorage.taskExists(event.habitId, event.date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${event.habitId} on ${event.date}, skipping creation`);
        
        // Ensure task has the proper taskType based on the metric type
        const properTaskType = determineTaskType(event.taskType, event.metricType, event.name);
        
        // Only update if the task type needs to be changed
        if (!existingTask.taskType || !isValidTaskType(existingTask.taskType) || existingTask.taskType !== properTaskType) {
          const updatedTask = {
            ...existingTask,
            taskType: properTaskType
          };
          
          // Save the updated task
          taskStorage.updateTask(existingTask.id, updatedTask);
          
          // Add task to UI if it exists in storage but not in memory
          eventManager.emit('task:create', updatedTask);
        } else {
          // Add task to UI if it exists in storage but not in memory
          eventManager.emit('task:create', existingTask);
        }
        
        // Force refresh task list
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 200);
        
        // Clean up processing flag after slight delay
        setTimeout(() => {
          delete processingRef.current[processingKey];
        }, 500);
        
        return existingTask.id;
      }
      
      // Determine the appropriate task type
      const taskType = determineTaskType(event.taskType, event.metricType, event.name);
      
      // Create new task
      const taskId = createHabitTask(
        event.habitId,
        event.templateId,
        event.name,
        event.duration,
        event.date,
        taskType
      );
      
      // Clean up processing flag after slight delay
      setTimeout(() => {
        delete processingRef.current[processingKey];
      }, 500);
      
      // Force update task list
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 200);
      
      return taskId;
    } catch (error) {
      console.error('Error processing habit task:', error);
      
      // Clean up processing flag on error
      delete processingRef.current[processingKey];
      
      return null;
    }
  }, [createHabitTask, determineTaskType, isValidTaskType]);
  
  return {
    processHabitTask
  };
};
