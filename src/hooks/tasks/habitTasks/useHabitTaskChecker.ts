
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook for checking habit tasks
 */
export const useHabitTaskChecker = () => {
  /**
   * Check for pending habit tasks
   */
  const checkPendingHabitTasks = useCallback((
    tasks: Task[],
    habitIds: string[]
  ) => {
    console.log(`Checking pending tasks for ${habitIds.length} habits`);
    
    // Find pending tasks for the habits
    const pendingTasks = tasks.filter(task => {
      return (
        !task.completed && 
        task.relationships?.habitId && 
        habitIds.includes(task.relationships.habitId)
      );
    });
    
    // Log result
    if (pendingTasks.length > 0) {
      console.log(`Found ${pendingTasks.length} pending habit tasks`);
      
      // Emit event for each pending task
      pendingTasks.forEach(task => {
        eventManager.emit('task:select', task.id);
      });
    } else {
      console.log('No pending habit tasks found');
    }
    
    return pendingTasks;
  }, []);
  
  return {
    checkPendingHabitTasks
  };
};
