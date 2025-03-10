
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { taskVerification } from '@/lib/verification/taskVerification';

/**
 * Hook for handling habit verification and recovery
 */
export const useHabitVerification = (
  items: Task[],
  dispatch: React.Dispatch<any>,
  shouldProcessEvent: (eventType: string, minDelay?: number) => boolean
) => {
  // Handle habit checking with improved verification
  const handleHabitCheck = useCallback(() => {
    if (!shouldProcessEvent('habits:check-pending', 1000)) return;
    
    console.log("TaskEvents: Checking for pending habits");
    window.dispatchEvent(new CustomEvent('habits:processed'));
    
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
  }, [items, dispatch, shouldProcessEvent]);
  
  return { handleHabitCheck };
};
