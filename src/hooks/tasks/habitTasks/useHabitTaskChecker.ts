
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for checking and verifying habit tasks with improved reliability
 */
export const useHabitTaskChecker = (tasks: Task[]) => {
  // Check for missing habit tasks by verifying storage against memory state
  const checkForMissingHabitTasks = useCallback(() => {
    console.log('Checking for missing habit tasks...');
    
    try {
      // Use the storage service to find missing tasks
      const missingTasks = taskStorage.findMissingTasks(tasks);
      
      if (missingTasks.length === 0) {
        console.log('No missing habit tasks found');
        return;
      }
      
      // Filter to just habit tasks
      const missingHabitTasks = missingTasks.filter(task => 
        task.relationships?.habitId
      );
      
      if (missingHabitTasks.length === 0) {
        console.log('No missing habit tasks found');
        return;
      }
      
      console.log(`Found ${missingHabitTasks.length} habit tasks in storage missing from memory`);
      
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
      
      return missingHabitTasks;
    } catch (error) {
      console.error('Error checking for missing tasks:', error);
      return [];
    }
  }, [tasks]);
  
  return {
    checkForMissingHabitTasks
  };
};
