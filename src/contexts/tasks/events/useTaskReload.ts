
import { useState, useCallback, useEffect } from 'react';
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
  
  // Set up a periodic reload to ensure data consistency
  useEffect(() => {
    if (isInitializing) {
      // Don't set up periodic reload during initialization
      return;
    }
    
    const periodicReloadId = setInterval(() => {
      console.log("TaskEvents: Periodic task reload triggered");
      // Use a shorter debounce for the periodic reload
      forceTasksReload({}, (prev) => prev);
    }, 30000); // Every 30 seconds (reduced from 60 seconds for more frequent sync)
    
    return () => clearInterval(periodicReloadId);
  }, [isInitializing]);
  
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
      if (now - lastReloadTime < 500) { // Reduced from 800ms to 500ms for faster response
        console.log("TaskEvents: Skipping rapid reload, last reload was", now - lastReloadTime, "ms ago");
        return;
      }
      
      setLastEventTime(prev => ({ ...prev, forceReload: now }));
      setPreventReentrantUpdate(true);
      
      const { tasks, completed } = taskState.loadFromStorage();
      console.log(`TaskEvents: Loaded ${tasks.length} tasks and ${completed.length} completed tasks from storage during force reload`);
      
      // Add debug logging for task types
      const tasksByType = {
        timer: tasks.filter(t => t.taskType === 'timer').length,
        journal: tasks.filter(t => t.taskType === 'journal').length,
        checklist: tasks.filter(t => t.taskType === 'checklist').length,
        screenshot: tasks.filter(t => t.taskType === 'screenshot').length,
        voicenote: tasks.filter(t => t.taskType === 'voicenote').length,
        regular: tasks.filter(t => !t.taskType || t.taskType === 'regular').length
      };
      console.log("TaskEvents: Task counts by type:", tasksByType);
      
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
      
      // Force UI refresh after data load
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 100);
      
      // Release the lock after a small delay
      setTimeout(() => {
        setPreventReentrantUpdate(false);
      }, 200); // Reduced from 300ms to 200ms
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
