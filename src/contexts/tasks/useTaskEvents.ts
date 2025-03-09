
import { useEffect, useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { taskState } from './taskState';
import { toast } from 'sonner';

/**
 * Hook for handling task-related events with improved error handling and synchronization
 */
export const useTaskEvents = (
  items: Task[],
  completed: Task[],
  dispatch: React.Dispatch<any>
) => {
  const lastTaskLoadTimeRef = useRef(Date.now());
  const pendingTaskUpdatesRef = useRef<Task[]>([]);
  const isInitializingRef = useRef(true);
  
  // Force reload tasks from localStorage
  const forceTasksReload = useCallback(() => {
    try {
      const now = Date.now();
      // Avoid excessive reloads
      if (now - lastTaskLoadTimeRef.current < 200 && !isInitializingRef.current) {
        console.log("TaskEvents: Skipping rapid reload, last load was", now - lastTaskLoadTimeRef.current, "ms ago");
        return;
      }
      
      lastTaskLoadTimeRef.current = now;
      const { tasks, completed } = taskState.loadFromStorage();
      
      // Process any pending task updates
      if (pendingTaskUpdatesRef.current.length > 0) {
        console.log(`TaskEvents: Adding ${pendingTaskUpdatesRef.current.length} pending tasks to loaded tasks`);
        
        // Merge pending tasks, avoiding duplicates
        pendingTaskUpdatesRef.current.forEach(pendingTask => {
          if (!tasks.some((t: Task) => t.id === pendingTask.id)) {
            tasks.push(pendingTask);
          }
        });
        
        // Clear pending tasks
        pendingTaskUpdatesRef.current = [];
        
        // Update localStorage
        localStorage.setItem('taskList', JSON.stringify(tasks));
      }
      
      dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });
      isInitializingRef.current = false;
    } catch (error) {
      console.error('TaskEvents: Error forcing tasks reload:', error);
    }
  }, [dispatch]);
  
  // Set up event listeners
  useEffect(() => {
    const unsubscribers = [
      // Handle task creation
      eventBus.on('task:create', (task: Task) => {
        console.log("TaskEvents: Creating task", task.id, task.name);
        
        // First, verify the task doesn't already exist
        if (taskState.taskExists(items, task)) {
          console.log(`TaskEvents: Task already exists, skipping: ${task.id}`);
          return;
        }
        
        // Add to pending updates
        pendingTaskUpdatesRef.current.push(task);
        
        // Add to state
        dispatch({ type: 'ADD_TASK', payload: task });
        
        // Update localStorage directly for immediate persistence
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        if (!storedTasks.some((t: Task) => t.id === task.id)) {
          localStorage.setItem('taskList', JSON.stringify([...storedTasks, task]));
        }
      }),
      
      // Handle task completion
      eventBus.on('task:complete', ({ taskId, metrics }) => {
        console.log("TaskEvents: Completing task", taskId);
        dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
      }),
      
      // Handle task deletion
      eventBus.on('task:delete', ({ taskId, reason }) => {
        console.log("TaskEvents: Deleting task", taskId, "reason:", reason);
        dispatch({ type: 'DELETE_TASK', payload: { taskId, reason } });
      }),
      
      // Handle task updates
      eventBus.on('task:update', ({ taskId, updates }) => {
        console.log("TaskEvents: Updating task", taskId);
        dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
      }),
      
      // Handle task selection
      eventBus.on('task:select', (taskId) => {
        console.log("TaskEvents: Selecting task", taskId);
        dispatch({ type: 'SELECT_TASK', payload: taskId });
      }),
      
      // Handle template deletion
      eventBus.on('habit:template-delete', ({ templateId }) => {
        console.log("TaskEvents: Received template delete event for", templateId);
        dispatch({ type: 'DELETE_TASKS_BY_TEMPLATE', payload: { templateId } });
      }),
      
      // Handle habit checking
      eventBus.on('habits:check-pending', () => {
        console.log("TaskEvents: Checking for pending habits");
        eventBus.emit('habits:processed', {});
        
        // Check for tasks in localStorage that aren't in memory
        setTimeout(() => {
          const missingTasks = taskState.verifyConsistency(items);
          if (missingTasks.length > 0) {
            console.log(`TaskEvents: Adding ${missingTasks.length} missing tasks to state`);
            missingTasks.forEach(task => {
              dispatch({ type: 'ADD_TASK', payload: task });
            });
            
            toast.info(`Loaded ${missingTasks.length} habit tasks`, {
              description: "Your habit tasks have been synchronized."
            });
          }
        }, 150);
      }),
    ];
    
    // Handle force update events from window
    const handleForceUpdate = () => {
      console.log("TaskEvents: Force updating task list");
      forceTasksReload();
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [dispatch, forceTasksReload, items]);
  
  // Provide the reload function
  return { forceTasksReload };
};
