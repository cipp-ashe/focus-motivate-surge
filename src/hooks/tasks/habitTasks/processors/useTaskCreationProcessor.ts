
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
        
        // Force task update
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 100);
      } else {
        // Determine proper task type from the metric type AND habit name
        const taskType = determineTaskType(event.taskType, event.metricType, event.name);
        
        // Create the habit task using the creator hook
        const newTaskId = createHabitTask(
          event.habitId,
          event.templateId,
          event.name,
          event.duration,
          event.date,
          taskType
        );
        
        if (newTaskId) {
          console.log(`Successfully created task ${newTaskId} for habit ${event.habitId} with type ${taskType}`);
          toast.success(`Created ${taskType} task: ${event.name}`, {
            description: "Your habit task has been scheduled."
          });
          
          // Force task updates with staggered timing
          [100, 300, 600].forEach(delay => {
            setTimeout(() => {
              window.dispatchEvent(new Event('force-task-update'));
            }, delay);
          });
        }
      }
    } catch (error) {
      console.error('Error processing habit task:', error);
      toast.error('Failed to create habit task', {
        description: "There was an error scheduling your habit task. Please try again."
      });
    } finally {
      // Clean up processing state after a delay
      setTimeout(() => {
        delete processingRef.current[processingKey];
        if (processingTimeoutsRef.current[processingKey]) {
          clearTimeout(processingTimeoutsRef.current[processingKey]);
          delete processingTimeoutsRef.current[processingKey];
        }
      }, 500);
    }
  }, [createHabitTask, determineTaskType, isValidTaskType]);
  
  return {
    processHabitTask
  };
};
