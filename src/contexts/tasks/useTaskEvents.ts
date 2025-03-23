
import { useCallback, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { EventType } from '@/types/events';

/**
 * Hook for handling task-related events in the TaskContext
 */
export const useTaskEvents = (
  tasks: Task[],
  completedTasks: Task[],
  dispatch: React.Dispatch<any>
) => {
  // Force reload of tasks from storage
  const forceTasksReload = useCallback(() => {
    console.log('TaskContext: Forcing task reload');
    eventManager.emit('task:force-update', undefined);
  }, []);

  // Set up event listeners
  useEffect(() => {
    // Set up listeners for each event type
    const createUnsubscribe = eventManager.on('task:create', (payload: Task) => {
      dispatch({ type: 'ADD_TASK', payload });
    });
    
    const updateUnsubscribe = eventManager.on('task:update', (payload: { taskId: string; updates: Partial<Task> }) => {
      dispatch({ type: 'UPDATE_TASK', payload });
    });
    
    const deleteUnsubscribe = eventManager.on('task:delete', (payload: { taskId: string; reason?: string }) => {
      dispatch({ type: 'DELETE_TASK', payload });
    });
    
    const completeUnsubscribe = eventManager.on('task:complete', (payload: { taskId: string; metrics?: any }) => {
      dispatch({ type: 'COMPLETE_TASK', payload });
    });
    
    const selectUnsubscribe = eventManager.on('task:select', (payload: string | null) => {
      dispatch({ type: 'SELECT_TASK', payload });
    });
    
    // Clean up listeners on unmount
    return () => {
      createUnsubscribe();
      updateUnsubscribe();
      deleteUnsubscribe();
      completeUnsubscribe();
      selectUnsubscribe();
    };
  }, [dispatch]);
  
  return { forceTasksReload };
};
