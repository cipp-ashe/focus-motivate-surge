
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { useTaskEvents } from '../useTaskEvents';
import { toast } from 'sonner';

/**
 * Hook to check existence of tasks in memory and localStorage with improved verification
 */
export const useTaskVerification = (tasks: Task[]) => {
  const { forceTaskUpdate } = useTaskEvents();
  
  /**
   * Check if a habit task exists in the current memory tasks
   */
  const checkTaskExistsInMemory = useCallback((habitId: string, date: string) => {
    const matchingTask = tasks.find(task => 
      task.relationships?.habitId === habitId && 
      task.relationships?.date === date
    );
    
    if (matchingTask) {
      console.log(`Found task in memory for habit ${habitId} on ${date}:`, matchingTask);
    } else {
      console.log(`No task found in memory for habit ${habitId} on ${date}`);
    }
    
    return matchingTask;
  }, [tasks]);
  
  /**
   * Check if a habit task exists in localStorage with enhanced recovery
   */
  const checkTaskExistsInStorage = useCallback((habitId: string, date: string) => {
    try {
      // Check localStorage directly
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const existingTask = storedTasks.find((task: Task) => 
        task.relationships?.habitId === habitId && 
        task.relationships?.date === date
      );
      
      if (existingTask) {
        console.log(`Found task in localStorage for habit ${habitId} on ${date}:`, existingTask);
        
        // If the task exists in localStorage but not in memory, directly add it to memory
        if (!tasks.some(t => t.id === existingTask.id)) {
          console.log(`Task exists in localStorage but not in memory, dispatching events to load it`);
          
          // Use progressive update strategy with multiple timings to ensure task is loaded
          for (let delay of [100, 300, 600]) {
            setTimeout(() => {
              window.dispatchEvent(new Event('force-task-update'));
              forceTaskUpdate();
            }, delay);
          }
        }
      } else {
        console.log(`No task found in localStorage for habit ${habitId} on ${date}`);
      }
      
      return existingTask;
    } catch (error) {
      console.error('Error checking localStorage for tasks:', error);
      return null;
    }
  }, [forceTaskUpdate, tasks]);
  
  /**
   * Verify that all habit tasks in localStorage are loaded in memory
   * Returns true if everything is in sync, false if not
   */
  const verifyAllTasksLoaded = useCallback(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const habitTasks = storedTasks.filter((task: Task) => task.relationships?.habitId);
      
      if (habitTasks.length === 0) {
        console.log('No habit tasks found in localStorage');
        return true;
      }
      
      // Find missing tasks
      const missingTasks = habitTasks.filter((storedTask: Task) => 
        !tasks.some(memTask => memTask.id === storedTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`Found ${missingTasks.length} tasks in localStorage missing from memory`);
        
        // If there are missing tasks, force an update and notify the user
        for (let delay of [50, 250, 500]) {
          setTimeout(() => {
            window.dispatchEvent(new Event('force-task-update'));
          }, delay);
        }
        
        if (missingTasks.length > 0) {
          toast.info(`Found ${missingTasks.length} habit tasks`, {
            description: "Synchronizing your scheduled habit tasks..."
          });
        }
        
        return false;
      }
      
      console.log('All habit tasks from localStorage are loaded in memory');
      return true;
    } catch (error) {
      console.error('Error verifying tasks:', error);
      return false;
    }
  }, [tasks]);
  
  return {
    checkTaskExistsInMemory,
    checkTaskExistsInStorage,
    verifyAllTasksLoaded
  };
};
