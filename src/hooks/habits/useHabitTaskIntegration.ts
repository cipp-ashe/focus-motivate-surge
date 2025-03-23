
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook to integrate habits with tasks
 */
export const useHabitTaskIntegration = () => {
  // Mock implementation of syncHabitsWithTasks
  const syncHabitsWithTasks = useCallback(() => {
    console.log('Syncing habits with tasks');
    eventManager.emit('habits:verify-tasks', {});
  }, []);
  
  // Check for pending tasks
  const checkPendingTasks = useCallback(() => {
    eventManager.emit('habits:check-pending', {});
  }, []);
  
  // Schedule a task for a habit
  const scheduleHabitTask = useCallback((
    habitId: string,
    name: string,
    duration: number,
    templateId: string
  ) => {
    eventManager.emit('habit:schedule', {
      habitId,
      name,
      duration,
      templateId,
      date: new Date().toISOString()
    });
  }, []);
  
  return {
    syncHabitsWithTasks,
    checkPendingTasks,
    scheduleHabitTask
  };
};
