
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { useTaskTypeProcessor } from './useTaskTypeProcessor';

/**
 * Hook for processing pending habit tasks in storage
 */
export const usePendingTaskProcessor = () => {
  const { isValidTaskType } = useTaskTypeProcessor();
  
  /**
   * Process any pending tasks (useful after navigation or initial load)
   */
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
          
          // Check if task has valid type, convert if needed
          if (!task.taskType || !isValidTaskType(task.taskType)) {
            // Convert to appropriate type based on habit metrics
            // For now, default to regular if we can't determine
            if (task.name && task.name.toLowerCase().includes('journal')) {
              task.taskType = 'journal';
            } else {
              task.taskType = 'regular';
            }
            
            // Save the updated task type
            taskStorage.updateTask(task.id, task);
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
  }, [isValidTaskType]);
  
  return {
    processPendingTasks
  };
};
