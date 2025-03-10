
import { useCallback } from 'react';
import { Task } from '@/types/tasks';

/**
 * Hook for handling task creation events
 */
export const useTaskCreationHandler = (
  items: Task[],
  dispatch: React.Dispatch<any>,
  setPendingTaskUpdates: (fn: (prev: Task[]) => Task[]) => void
) => {
  // Handle task creation
  const handleTaskCreate = useCallback((task: Task) => {
    console.log("TaskEvents: Creating task", task.id, task.name);
    
    // First, verify the task doesn't already exist in the current state
    const existsInState = items.some(t => t.id === task.id);
    if (existsInState) {
      console.log(`TaskEvents: Task ${task.id} already exists in state, skipping`);
      return;
    }
    
    // Add to pending updates and dispatch
    setPendingTaskUpdates(prev => [...prev, task]);
    dispatch({ type: 'ADD_TASK', payload: task });
    
    // Log the current task count
    console.log(`TaskEvents: Tasks in state after adding task: ${items.length + 1}`);
  }, [items, dispatch, setPendingTaskUpdates]);
  
  return { handleTaskCreate };
};
