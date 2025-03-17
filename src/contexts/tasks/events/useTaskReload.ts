
import { useCallback, useEffect, useState } from 'react';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';

export const useTaskReload = (
  dispatch: React.Dispatch<any>,
  shouldReloadOnMount: boolean = true
) => {
  const [lastReloadTime, setLastReloadTime] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Function to reload tasks from storage
  const reloadTasks = useCallback(() => {
    try {
      const now = Date.now();
      setLastReloadTime(now);
      
      // Load tasks from storage
      const result = taskStorage.loadAllTasks();
      
      // Dispatch load action to update state
      dispatch({
        type: 'LOAD_TASKS',
        payload: {
          items: result.active,
          completed: result.completed
        }
      });
      
      console.log(`TaskReload: Reloaded ${result.active.length} active and ${result.completed.length} completed tasks`);
      return result;
    } catch (error) {
      console.error('Error reloading tasks:', error);
      return { active: [], completed: [] };
    }
  }, [dispatch]);

  // Set up event handlers
  useEffect(() => {
    // Initial load on mount if required
    if (shouldReloadOnMount) {
      reloadTasks();
      setIsInitialLoad(false);
    }
    
    // Handle task:reload event
    const handleTaskReload = () => {
      // Don't reload if we just did
      const now = Date.now();
      if (now - lastReloadTime < 500) {
        console.log('TaskReload: Skipping reload, too frequent');
        return;
      }
      
      console.log('TaskReload: Handling task:reload event');
      reloadTasks();
    };
    
    // Subscribe to events
    eventBus.on('task:reload', handleTaskReload);
    window.addEventListener('force-task-update', handleTaskReload);
    
    // Clean up
    return () => {
      eventBus.off('task:reload', handleTaskReload);
      window.removeEventListener('force-task-update', handleTaskReload);
    };
  }, [reloadTasks, lastReloadTime, shouldReloadOnMount]);

  return { reloadTasks };
};
