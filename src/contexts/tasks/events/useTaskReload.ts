
import { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { taskState } from '../taskState';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for managing task reload operations
 */
export const useTaskReload = (dispatch: React.Dispatch<any>) => {
  const [preventReentrantUpdate, setPreventReentrantUpdate] = useState(false);
  const [pendingTaskUpdates, setPendingTaskUpdates] = useState<Task[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Force reload tasks from storage
  const forceTasksReload = useCallback((lastEventTime: Record<string, number>, setLastEventTime: (fn: (prev: Record<string, number>) => Record<string, number>) => void) => {
    try {
      // Prevent reentrant calls
      if (preventReentrantUpdate) {
        console.log("TaskEvents: Preventing reentrant force reload");
        return;
      }
      
      // Debounce force reloads
      const now = Date.now();
      const lastReloadTime = lastEventTime['forceReload'] || 0;
      if (now - lastReloadTime < 800) {
        console.log("TaskEvents: Skipping rapid reload, last reload was", now - lastReloadTime, "ms ago");
        return;
      }
      
      setLastEventTime(prev => ({ ...prev, forceReload: now }));
      setPreventReentrantUpdate(true);
      
      const { tasks, completed } = taskState.loadFromStorage();
      console.log(`TaskEvents: Loaded ${tasks.length} tasks from storage during force reload`);
      
      // Process any pending task updates
      if (pendingTaskUpdates.length > 0) {
        console.log(`TaskEvents: Adding ${pendingTaskUpdates.length} pending tasks to loaded tasks`);
        
        // Merge pending tasks, avoiding duplicates
        pendingTaskUpdates.forEach(pendingTask => {
          if (!tasks.some((t: Task) => t.id === pendingTask.id)) {
            tasks.push(pendingTask);
          }
        });
        
        // Clear pending tasks
        setPendingTaskUpdates([]);
        
        // Update storage with merged tasks
        taskStorage.saveTasks(tasks);
      }
      
      dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });
      setIsInitializing(false);
      
      // Release the lock after a small delay
      setTimeout(() => {
        setPreventReentrantUpdate(false);
      }, 300);
    } catch (error) {
      console.error('TaskEvents: Error forcing tasks reload:', error);
      setPreventReentrantUpdate(false);
    }
  }, [dispatch, pendingTaskUpdates, preventReentrantUpdate]);
  
  return {
    preventReentrantUpdate,
    pendingTaskUpdates,
    setPendingTaskUpdates,
    isInitializing,
    setIsInitializing,
    forceTasksReload,
  };
};
