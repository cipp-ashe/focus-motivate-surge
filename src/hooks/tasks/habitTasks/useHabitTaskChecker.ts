
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';

/**
 * Hook for checking and verifying habit tasks
 */
export const useHabitTaskChecker = (tasks: Task[]) => {
  // Check for missing habit tasks by verifying localStorage against memory state
  const checkForMissingHabitTasks = useCallback(() => {
    console.log('Checking for missing habit tasks...');
    
    try {
      // Get all tasks from localStorage
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      
      // Filter to just habit tasks
      const habitTasks = storedTasks.filter((task: Task) => 
        task.relationships?.habitId
      );
      
      if (habitTasks.length === 0) {
        console.log('No habit tasks found in localStorage');
        return;
      }
      
      // Find tasks in localStorage but not in memory
      const missingTasks = habitTasks.filter((storedTask: Task) => 
        !tasks.some(memTask => memTask.id === storedTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`Found ${missingTasks.length} habit tasks in localStorage missing from memory`);
        
        // Force multiple updates to ensure tasks are loaded
        for (let delay of [50, 300, 600]) {
          setTimeout(() => {
            window.dispatchEvent(new Event('force-task-update'));
          }, delay);
        }
        
        // Also emit an event for habit checking
        setTimeout(() => {
          eventBus.emit('habits:check-pending', {});
        }, 150);
      } else {
        console.log('All habit tasks from localStorage are in memory');
      }
    } catch (error) {
      console.error('Error checking for missing tasks:', error);
    }
  }, [tasks]);
  
  return {
    checkForMissingHabitTasks
  };
};
