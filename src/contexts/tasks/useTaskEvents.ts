
import { useCallback, useEffect, useState, useRef } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { useEvent } from '@/hooks/useEvent';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook for handling task events
 */
export const useTaskEvents = (
  items: Task[],
  completed: Task[],
  dispatch: React.Dispatch<any>
) => {
  const [pendingTaskUpdates, setPendingTaskUpdates] = useState<Task[]>([]);
  const lastNavigationRef = useRef<number>(Date.now());
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Force reload tasks from storage to ensure our state is consistent
  const forceTasksReload = useCallback(() => {
    try {
      // Skip frequent reloads
      const now = Date.now();
      if (now - lastNavigationRef.current < 300) {
        console.log('TaskEvents: Skipping reload, too soon after last navigation');
        return;
      }
      
      lastNavigationRef.current = now;
      console.log('TaskEvents: Force reloading tasks from storage');
      
      // Load tasks from storage
      const storedTasks = taskStorage.loadTasks();
      const completedTasks = taskStorage.loadCompletedTasks();
      
      // Update state with the latest storage data
      dispatch({ 
        type: 'LOAD_TASKS', 
        payload: { 
          items: storedTasks,
          completed: completedTasks
        } 
      });
      
      // Notify the UI that tasks have been refreshed
      window.dispatchEvent(new Event('task-ui-refresh'));
    } catch (error) {
      console.error('Error during force task reload:', error);
    }
  }, [dispatch]);
  
  // Handle task creation events
  useEvent('task:create', (task: Task) => {
    console.log("TaskEvents: Handling task create for", task.id, task);
    
    // Skip if the task already exists in our state
    const existingTask = items.find(t => t.id === task.id);
    if (existingTask) {
      console.log("TaskEvents: Task already exists in state, skipping");
      return;
    }
    
    // Add to pending updates and dispatch
    setPendingTaskUpdates(prev => [...prev, task]);
    dispatch({ type: 'ADD_TASK', payload: task });
    
    // Ensure changes are saved to storage
    taskStorage.addTask(task);
  });
  
  // Handle task update events
  useEvent('task:update', ({ taskId, updates }: { taskId: string, updates: Partial<Task> }) => {
    console.log("TaskEvents: Handling task update for", taskId, updates);
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    
    // Update in storage to ensure consistency
    const task = items.find(t => t.id === taskId);
    if (task) {
      taskStorage.updateTask(taskId, { ...task, ...updates });
    }
  });
  
  // Handle task delete events
  useEvent('task:delete', ({ taskId }: { taskId: string }) => {
    console.log("TaskEvents: Handling task delete for", taskId);
    dispatch({ type: 'DELETE_TASK', payload: { taskId, reason: 'event' } });
    
    // Delete from storage as well
    taskStorage.removeTask(taskId);
  });
  
  // Handle task completion events
  useEvent('task:complete', ({ taskId, metrics }: { taskId: string, metrics?: any }) => {
    console.log("TaskEvents: Handling task complete for", taskId, metrics);
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
  });
  
  // Handle task selection events
  useEvent('task:select', (taskId: string) => {
    console.log("TaskEvents: Handling task select for", taskId);
    dispatch({ type: 'SELECT_TASK', payload: taskId });
  });
  
  // Handle task reload events
  useEvent('task:reload', () => {
    console.log("TaskEvents: Handling task reload event");
    forceTasksReload();
  });
  
  // Set up a popstate listener to detect back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      console.log("TaskEvents: Detected navigation via popstate");
      
      // Small delay for stability
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      
      reloadTimeoutRef.current = setTimeout(forceTasksReload, 100);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Listen for route changes
    const handleRouteChange = () => {
      console.log("TaskEvents: Detected route change");
      
      // Small delay to ensure everything is loaded
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      
      reloadTimeoutRef.current = setTimeout(forceTasksReload, 100);
    };
    
    window.addEventListener('routechange', handleRouteChange);
    
    // Reload tasks when visibility changes (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("TaskEvents: Page became visible, reloading tasks");
        forceTasksReload();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Force a reload when component mounts
    forceTasksReload();
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('routechange', handleRouteChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, [forceTasksReload]);
  
  return { forceTasksReload };
};
