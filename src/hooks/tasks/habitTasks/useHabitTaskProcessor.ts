import { useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { taskStorage } from '@/lib/storage/taskStorage';
import { toast } from 'sonner';

/**
 * Hook for processing habit tasks with improved localStorage synchronization,
 * error handling, and debouncing
 */
export const useHabitTaskProcessor = () => {
  const { createHabitTask } = useHabitTaskCreator();
  const processingRef = useRef<Record<string, boolean>>({});
  const processingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Process a single habit task event with debouncing and improved error handling
  const processHabitTask = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
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
      // Check if task already exists using new storage service
      const existingTask = taskStorage.taskExists(event.habitId, event.date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${event.habitId} on ${event.date}, skipping creation`);
        
        // Ensure task is loaded into memory state if it exists in storage but not in memory
        const tasksInMemory = JSON.parse(localStorage.getItem('tasks-in-memory') || '[]');
        const isInMemory = tasksInMemory.includes(existingTask.id);
        
        if (!isInMemory) {
          console.log(`Task ${existingTask.id} exists in storage but not in memory, emitting task:create event`);
          eventBus.emit('task:create', existingTask);
          
          // Add to memory tracking
          tasksInMemory.push(existingTask.id);
          localStorage.setItem('tasks-in-memory', JSON.stringify(tasksInMemory));
        }
        
        // Always force a task update to ensure UI is in sync
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 100);
      } else {
        // Create the habit task using the creator hook
        const newTaskId = createHabitTask(
          event.habitId,
          event.templateId,
          event.name,
          event.duration,
          event.date
        );
        
        if (newTaskId) {
          // Add to memory tracking
          const tasksInMemory = JSON.parse(localStorage.getItem('tasks-in-memory') || '[]');
          tasksInMemory.push(newTaskId);
          localStorage.setItem('tasks-in-memory', JSON.stringify(tasksInMemory));
          
          console.log(`Successfully created task ${newTaskId} for habit ${event.habitId}`);
          toast.success(`Created habit task: ${event.name}`, {
            description: "Your habit task has been scheduled."
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
  
  // Handle habit schedule events from the event bus with prioritization
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
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
    
    // For critical habit scheduling events, set up a retry mechanism
    // to ensure the task is eventually created even if there are temporary issues
    const retryTimes = [500, 1000, 2000]; // Exponential backoff
    
    retryTimes.forEach(delay => {
      setTimeout(() => {
        // Before retrying, check if the task exists now
        const existingTask = taskStorage.taskExists(event.habitId, event.date);
        
        if (!existingTask) {
          console.log(`Retry ${delay}ms: Task still not found for habit ${event.habitId}, retrying creation`);
          processHabitTask(event);
        } else {
          console.log(`Retry ${delay}ms: Task now exists for habit ${event.habitId}, no need to retry`);
        }
      }, delay);
    });
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
        
        // Keep track of tasks in memory
        const tasksInMemory = JSON.parse(localStorage.getItem('tasks-in-memory') || '[]');
        let updatedMemoryList = false;
        
        // Check each habit task
        habitTasks.forEach(task => {
          if (!tasksInMemory.includes(task.id)) {
            console.log(`Task ${task.id} for habit ${task.relationships?.habitId} not tracked in memory, emitting task:create`);
            eventBus.emit('task:create', task);
            tasksInMemory.push(task.id);
            updatedMemoryList = true;
          }
        });
        
        // Update memory tracking if changed
        if (updatedMemoryList) {
          localStorage.setItem('tasks-in-memory', JSON.stringify(tasksInMemory));
        }
        
        // Force multiple task updates with staggered timing for maximum reliability
        [100, 300, 600].forEach(delay => {
          setTimeout(() => {
            window.dispatchEvent(new Event('force-task-update'));
          }, delay);
        });
      } else {
        console.log('No habit tasks found in localStorage');
      }
    } catch (error) {
      console.error('Error processing pending tasks:', error);
      
      // Recovery mechanism - force an update anyway
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 500);
    }
  }, []);
  
  return { 
    processHabitTask,
    handleHabitSchedule,
    processPendingTasks
  };
};
