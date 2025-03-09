
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { useTaskEvents } from '../useTaskEvents';

/**
 * Hook to check for missing habit tasks and verify against localStorage
 */
export const useHabitTaskChecker = (tasks: Task[]) => {
  const { forceTaskUpdate } = useTaskEvents();
  
  /**
   * Check for missing habit tasks and force update if needed
   */
  const checkForMissingHabitTasks = useCallback(() => {
    console.log("Manually checking for missing habit tasks");
    
    // Trigger a habit check
    eventBus.emit('habits:check-pending', {});
    
    // Verify against localStorage tasks
    setTimeout(() => {
      // Get all tasks from localStorage
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      
      // Find habit tasks
      const habitTasks = storedTasks.filter((task: Task) => task.relationships?.habitId);
      
      if (habitTasks.length > 0) {
        console.log(`Found ${habitTasks.length} habit tasks in localStorage during check`);
        
        // Find tasks that exist in localStorage but not in memory
        const missingTasks = habitTasks.filter((storedTask: Task) => 
          !tasks.some(memTask => memTask.id === storedTask.id)
        );
        
        if (missingTasks.length > 0) {
          console.log(`Found ${missingTasks.length} tasks in localStorage that are missing from memory`);
          
          // Force a task update to load these
          forceTaskUpdate();
        } else {
          console.log('All habit tasks from localStorage are already loaded in memory');
        }
      }
    }, 200);
  }, [tasks, forceTaskUpdate]);
  
  return {
    checkForMissingHabitTasks
  };
};
