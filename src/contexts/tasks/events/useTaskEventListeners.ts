import { useEffect } from 'react';
import { Task } from '@/types/task';
import { taskVerification } from '@/lib/verification/taskVerification';
import { useEvent } from '@/hooks/useEvent';

/**
 * Hook for setting up task event listeners
 */
export const useTaskEventListeners = (
  items: Task[],
  dispatch: React.Dispatch<any>,
  eventHandlers: {
    handleTaskCreate: (task: Task) => void;
    handleTaskComplete: (data: { taskId: string, metrics?: any }) => void;
    handleTaskDelete: (data: { taskId: string, reason?: string }) => void;
    handleTaskUpdate: (data: { taskId: string, updates: any }) => void;
    handleTaskSelect: (taskId: string) => void;
    handleTemplateDelete: (data: { templateId: string, isOriginatingAction?: boolean }) => void;
    handleHabitCheck: () => void;
    handleTaskDismiss: (data: { taskId: string, habitId: string, date: string }) => void;
  },
  forceTasksReload: () => void,
  lastForceUpdateTime: number,
  setLastForceUpdateTime: (time: number) => void
) => {
  // Set up event listeners using the useEvent hook
  useEvent('task:create', eventHandlers.handleTaskCreate);
  useEvent('task:complete', eventHandlers.handleTaskComplete);
  useEvent('task:delete', eventHandlers.handleTaskDelete);
  useEvent('task:update', eventHandlers.handleTaskUpdate);
  useEvent('task:select', eventHandlers.handleTaskSelect);
  useEvent('habit:template-delete', eventHandlers.handleTemplateDelete);
  useEvent('habits:check-pending', eventHandlers.handleHabitCheck);
  useEvent('task:dismiss', eventHandlers.handleTaskDismiss);
  
  // Handle force update events
  useEvent('task:force-update', () => {
    forceTasksReload();
  });
  
  useEvent('task:reload', () => {
    forceTasksReload();
  });
  
  // Handle window events that aren't migrated to eventManager yet
  useEffect(() => {
    // Handle force update events from window with debouncing
    const handleForceUpdate = () => {
      const now = Date.now();
      if (now - lastForceUpdateTime > 500) {
        setLastForceUpdateTime(now);
        console.log("TaskEvents: Force updating task list (debounced)");
        forceTasksReload();
      } else {
        console.log("TaskEvents: Skipping force update, too frequent");
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    window.addEventListener('templates-tasks-cleaned', handleForceUpdate);
    
    // Setup verification cleanup
    const verificationCleanup = taskVerification.setupPeriodicVerification(
      () => items,
      (missingTasks) => {
        if (missingTasks.length > 0) {
          console.log(`TaskEvents: Adding ${missingTasks.length} missing tasks from verification`);
          missingTasks.forEach(task => {
            dispatch({ type: 'ADD_TASK', payload: task });
          });
        }
      },
      60000 // Check every minute
    );
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
      window.removeEventListener('templates-tasks-cleaned', handleForceUpdate);
      verificationCleanup();
    };
  }, [
    dispatch, 
    forceTasksReload, 
    items, 
    lastForceUpdateTime, 
    setLastForceUpdateTime
  ]);
};
