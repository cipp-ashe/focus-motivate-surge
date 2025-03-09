
import { useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';

/**
 * Hook for cleaning up habit tasks
 */
export const useHabitTaskCleanup = (tasks: Task[]) => {
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handler for task deletion
  const handleTaskDelete = useCallback(({ taskId, reason }: { taskId: string, reason?: string }) => {
    console.log(`HabitTaskCleanup: Task ${taskId} deleted with reason: ${reason || 'unknown'}`);
    
    // Find the task that was deleted
    const task = tasks.find(t => t.id === taskId);
    
    // If it was a habit task, update tracking
    if (task?.relationships?.habitId) {
      console.log(`HabitTaskCleanup: Deleted task was from habit ${task.relationships.habitId}`);
      
      // Here you could perform additional cleanup like updating habit progress, etc.
    }
  }, [tasks]);
  
  // Setup daily cleanup of old tasks
  const setupDailyCleanup = useCallback(() => {
    // Calculate time until midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`HabitTaskCleanup: Scheduling daily cleanup in ${Math.round(timeUntilMidnight / 1000 / 60)} minutes`);
    
    // Clear any existing timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
    
    // Set new timeout for midnight cleanup
    cleanupTimeoutRef.current = setTimeout(() => {
      console.log('HabitTaskCleanup: Running daily cleanup of old habit tasks');
      
      // Implement cleanup logic here
      // Example: Delete tasks older than X days
      
      // Schedule next cleanup
      setupDailyCleanup();
    }, timeUntilMidnight);
    
    return cleanupTimeoutRef.current;
  }, []);
  
  return {
    handleTaskDelete,
    setupDailyCleanup
  };
};
