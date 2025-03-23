
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useSyncHandler } from './taskIntegration/useSyncHandler';

/**
 * Hook to integrate habits with tasks
 */
export const useHabitTaskIntegration = () => {
  const { syncHabitsWithTasks } = useSyncHandler();
  
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
