
import { useEffect, useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { taskState } from './taskState';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { taskVerification } from '@/lib/verification/taskVerification';

/**
 * Hook for handling task-related events with improved error handling, synchronization and verification
 */
export const useTaskEvents = (
  items: Task[],
  completed: Task[],
  dispatch: React.Dispatch<any>
) => {
  const lastTaskLoadTimeRef = useRef(Date.now());
  const pendingTaskUpdatesRef = useRef<Task[]>([]);
  const isInitializingRef = useRef(true);
  const preventReentrantUpdateRef = useRef(false);
  const lastEventTime = useRef<Record<string, number>>({});
  
  // Force reload tasks from storage
  const forceTasksReload = useCallback(() => {
    try {
      // Prevent reentrant calls - if we're already in a reload, don't start another
      if (preventReentrantUpdateRef.current) {
        console.log("TaskEvents: Preventing reentrant force reload");
        return;
      }
      
      // Debounce force reloads heavily
      const now = Date.now();
      const lastReloadTime = lastEventTime.current['forceReload'] || 0;
      if (now - lastReloadTime < 800) {
        console.log("TaskEvents: Skipping rapid reload, last reload was", now - lastReloadTime, "ms ago");
        return;
      }
      
      lastEventTime.current['forceReload'] = now;
      preventReentrantUpdateRef.current = true;
      
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
        
        // Update storage with merged tasks
        taskStorage.saveTasks(tasks);
      }
      
      dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });
      isInitializingRef.current = false;
      
      // Release the lock after a small delay to prevent rapid successive calls
      setTimeout(() => {
        preventReentrantUpdateRef.current = false;
      }, 300);
    } catch (error) {
      console.error('TaskEvents: Error forcing tasks reload:', error);
      preventReentrantUpdateRef.current = false;
    }
  }, [dispatch]);
  
  // Helper function to debounce events
  const shouldProcessEvent = useCallback((eventType: string, minDelay: number = 300): boolean => {
    const now = Date.now();
    const lastTime = lastEventTime.current[eventType] || 0;
    
    if (now - lastTime < minDelay) {
      console.log(`TaskEvents: Skipping ${eventType}, too frequent (${now - lastTime}ms)`);
      return false;
    }
    
    lastEventTime.current[eventType] = now;
    return true;
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    const unsubscribers = [
      // Handle task creation
      eventBus.on('task:create', (task: Task) => {
        console.log("TaskEvents: Creating task", task.id, task.name);
        
        if (!shouldProcessEvent(`task:create:${task.id}`, 500)) return;
        
        // First, verify the task doesn't already exist
        if (taskState.taskExists(items, task)) {
          console.log(`TaskEvents: Task already exists, skipping: ${task.id}`);
          return;
        }
        
        // Add to pending updates
        pendingTaskUpdatesRef.current.push(task);
        
        // Add to state
        dispatch({ type: 'ADD_TASK', payload: task });
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
        
        // Delete tasks from storage first
        taskStorage.deleteTasksByTemplate(templateId);
        
        // Then update state
        dispatch({ type: 'DELETE_TASKS_BY_TEMPLATE', payload: { templateId } });
      }),
      
      // Handle habit checking with improved verification
      eventBus.on('habits:check-pending', () => {
        console.log("TaskEvents: Checking for pending habits");
        
        if (!shouldProcessEvent('habits:check-pending', 1000)) return;
        
        eventBus.emit('habits:processed', {});
        
        // Check for tasks in storage that aren't in memory
        setTimeout(() => {
          const missingTasks = taskVerification.recoverMissingTasks(items);
          
          if (missingTasks.length > 0) {
            console.log(`TaskEvents: Adding ${missingTasks.length} missing tasks to state`);
            
            missingTasks.forEach(task => {
              dispatch({ type: 'ADD_TASK', payload: task });
            });
          }
        }, 150);
      }),
    ];
    
    // Handle force update events from window with debouncing
    const lastForceUpdateTime = useRef(0);
    
    const handleForceUpdate = () => {
      const now = Date.now();
      // Debounce force updates to prevent infinite loops
      if (now - lastForceUpdateTime.current > 800) {
        lastForceUpdateTime.current = now;
        console.log("TaskEvents: Force updating task list (debounced)");
        forceTasksReload();
      } else {
        console.log("TaskEvents: Skipping force update, too frequent");
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    // Set up periodic verification for task consistency with reduced frequency
    const verificationCleanup = taskVerification.setupPeriodicVerification(
      () => items,
      (missingTasks) => {
        if (missingTasks.length > 0) {
          missingTasks.forEach(task => {
            dispatch({ type: 'ADD_TASK', payload: task });
          });
        }
      },
      60000 // Check every minute instead of every 30 seconds to reduce overhead
    );
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
      window.removeEventListener('force-task-update', handleForceUpdate);
      verificationCleanup();
    };
  }, [dispatch, forceTasksReload, items, shouldProcessEvent]);
  
  // Provide the reload function
  return { forceTasksReload };
};
