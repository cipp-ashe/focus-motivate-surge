
import { useCallback, useRef, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task, TaskType } from '@/types/tasks';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { taskStorage } from '@/lib/storage/taskStorage';
import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent';

/**
 * Hook for processing habit tasks with improved localStorage synchronization,
 * error handling, and debouncing
 */
export const useHabitTaskProcessor = () => {
  const { createHabitTask } = useHabitTaskCreator();
  const processingRef = useRef<Record<string, boolean>>({});
  const processingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const pendingTasksRef = useRef<Task[]>([]);
  
  // Set up event listeners with the new event system
  useEffect(() => {
    console.log("useHabitTaskProcessor: Setting up event listeners");
    
    // Clean up
    return () => {
      // Clear any processing timeouts
      Object.values(processingTimeoutsRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);
  
  // Handle habit schedule events
  useEvent('habit:schedule', (event) => {
    handleHabitSchedule(event);
  });
  
  // Handle check pending events
  useEvent('habits:check-pending', () => {
    processPendingTasks();
  });
  
  // Process a single habit task event with debouncing and improved error handling
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
        const properTaskType = determineTaskType(event.taskType, event.metricType);
        
        // Only update if the task type needs to be changed - don't convert from a specific type back to "habit"
        if (existingTask.taskType === 'habit' || !existingTask.taskType) {
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
        // Determine proper task type from the metric type
        const taskType = determineTaskType(event.taskType, event.metricType);
        
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
  }, [createHabitTask]);
  
  // Helper function to determine the appropriate task type
  const determineTaskType = (taskType?: TaskType, metricType?: string): TaskType => {
    // If a specific non-habit task type is provided, use it
    if (taskType && taskType !== 'habit') {
      return taskType;
    }
    
    // Determine task type based on metric type
    if (metricType === 'timer') {
      return 'timer';
    } else if (metricType === 'journal') {
      return 'journal';
    } else if (metricType === 'checklist') {
      return 'checklist';
    } else if (metricType === 'voicenote') {
      return 'voicenote';
    } else if (metricType === 'screenshot') {
      return 'screenshot';
    }
    
    // Default fallback - use regular instead of habit
    return 'regular';
  };
  
  // Handle habit schedule events from the event bus with prioritization
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
  }) => {
    // Validate the event data
    if (!event.habitId || !event.name || !event.date) {
      console.error('Invalid habit schedule event:', event);
      return;
    }
    
    // Add robust logging for debugging
    console.log(`Handling habit schedule event for ${event.name} (${event.habitId}), templateId: ${event.templateId}`);
    
    // Ensure date format is correct - expect string format like "Sun Mar 09 2025"
    if (typeof event.date !== 'string' || event.date.split(' ').length !== 4) {
      // Try to fix the date format if it's incorrect
      const dateObj = new Date(event.date);
      if (!isNaN(dateObj.getTime())) {
        event.date = dateObj.toDateString();
        console.log(`Corrected date format to: ${event.date}`);
      } else {
        console.error('Invalid date format in habit schedule event:', event.date);
        toast.error('Failed to schedule habit: invalid date format');
        return;
      }
    }
    
    // Ensure duration is valid
    if (!event.duration || typeof event.duration !== 'number' || event.duration <= 0) {
      event.duration = 1500; // Default to 25 minutes
      console.log(`Using default duration (1500 seconds) for habit ${event.habitId}`);
    }
    
    // Check template ID exists
    if (!event.templateId) {
      console.warn(`No templateId provided for habit ${event.habitId}, using 'custom' as default`);
      event.templateId = 'custom';
    }
    
    // Pass straight to processor with data validation complete
    processHabitTask(event);
  }, [processHabitTask]);
  
  // Process any pending tasks (useful after navigation or initial load)
  const processPendingTasks = useCallback(() => {
    console.log('Checking for any pending habit tasks...');
    
    try {
      // Use the storage service to check for habit tasks
      const allTasks = taskStorage.loadTasks();
      const habitTasks = allTasks.filter((task: Task) => task.relationships?.habitId);
      
      if (habitTasks.length > 0) {
        console.log(`Found ${habitTasks.length} habit tasks in localStorage, ensuring they're loaded in memory`);
        
        // Emit task:create events for each habit task to ensure they're in memory
        habitTasks.forEach(task => {
          console.log(`Ensuring habit task ${task.id} is loaded in memory`);
          
          // If the task is still using the generic 'habit' type, convert it to a proper type
          if (task.taskType === 'habit') {
            task.taskType = 'regular'; // Default to regular if we can't determine the type
          }
          
          eventManager.emit('task:create', task);
        });
        
        // Force multiple task updates with staggered timing for reliability
        [100, 300, 600].forEach(delay => {
          setTimeout(() => {
            window.dispatchEvent(new Event('force-task-update'));
          }, delay);
        });
        
        return true;
      } else {
        console.log('No habit tasks found in localStorage');
        return false;
      }
    } catch (error) {
      console.error('Error processing pending tasks:', error);
      
      // Recovery mechanism - force an update anyway
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 500);
      
      return false;
    }
  }, []);
  
  return { 
    processHabitTask,
    handleHabitSchedule,
    processPendingTasks
  };
};
