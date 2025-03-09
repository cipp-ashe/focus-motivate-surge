
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { useHabitTaskTracker } from './useHabitTaskTracker';

/**
 * Hook for handling cleanup and deletion of habit tasks
 */
export const useHabitTaskCleanup = (tasks: Task[]) => {
  const { removeTrackedTask } = useHabitTaskTracker();
  
  /**
   * Handle task deletion
   */
  const handleTaskDelete = useCallback(({ taskId }: { taskId: string, reason?: string }) => {
    // Find the task
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.relationships?.habitId || !task.relationships?.date) return;
    
    // Remove from tracking map
    const wasRemoved = removeTrackedTask(task.relationships.habitId, task.relationships.date);
    if (wasRemoved) {
      console.log(`Removed tracked task key for ${task.relationships.habitId}-${task.relationships.date} (task ${taskId})`);
    }
  }, [tasks, removeTrackedTask]);
  
  /**
   * Set up daily cleanup for the tracking map
   */
  const setupDailyCleanup = useCallback((clearAllTrackedTasks: () => void) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      console.log('Clearing scheduled tasks tracking map');
      clearAllTrackedTasks();
      setupDailyCleanup(clearAllTrackedTasks); // Set up next day's cleanup
    }, timeUntilMidnight);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return {
    handleTaskDelete,
    setupDailyCleanup
  };
};
