
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { taskVerification } from '@/lib/verification/taskVerification';

/**
 * Hook for verifying habit tasks and checking for missing tasks
 */
export const useHabitTaskChecker = () => {
  /**
   * Check for any missing habit tasks and recover them
   */
  const checkForMissingHabitTasks = useCallback(() => {
    try {
      console.log('Checking for missing habit tasks...');
      
      // Emit event to check pending habit tasks
      eventManager.emit('habits:check-pending', {});
      
      // Force task update
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 100);
    } catch (error) {
      console.error('Error checking for missing habit tasks:', error);
    }
  }, []);
  
  return {
    checkForMissingHabitTasks
  };
};
