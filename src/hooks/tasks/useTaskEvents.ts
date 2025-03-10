
import { useCallback, useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for handling task-related events
 */
export const useTaskEvents = () => {
  /**
   * Force task update - reloads tasks from storage and updates the UI
   */
  const forceTaskUpdate = useCallback(() => {
    console.log("useTaskEvents: Forcing task update");
    
    // Dispatch event to force UI update
    window.dispatchEvent(new Event('force-task-update'));
    
    // Load tasks from storage
    const tasks = taskStorage.loadTasks();
    console.log("useTaskEvents: Loaded tasks from storage:", tasks);
    
    // Emit event to notify other components
    eventBus.emit('tasks:reloaded', { count: tasks.length });
  }, []);
  
  /**
   * Set up event listeners for task-related events
   */
  useEffect(() => {
    const handleHabitProcessed = () => {
      console.log("useTaskEvents: Habit processed, forcing task update");
      forceTaskUpdate();
    };
    
    // Listen for habit processed event
    eventBus.on('habits:processed', handleHabitProcessed);
    
    return () => {
      eventBus.off('habits:processed', handleHabitProcessed);
    };
  }, [forceTaskUpdate]);
  
  return { forceTaskUpdate };
};
