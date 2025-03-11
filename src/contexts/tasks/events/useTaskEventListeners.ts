
import { useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskVerification } from '@/lib/verification/taskVerification';

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
  // Set up event listeners
  useEffect(() => {
    const unsubscribers = [
      // Handle task creation
      eventBus.on('task:create', eventHandlers.handleTaskCreate),
      
      // Handle task completion
      eventBus.on('task:complete', eventHandlers.handleTaskComplete),
      
      // Handle task deletion
      eventBus.on('task:delete', eventHandlers.handleTaskDelete),
      
      // Handle task updates
      eventBus.on('task:update', eventHandlers.handleTaskUpdate),
      
      // Handle task selection
      eventBus.on('task:select', eventHandlers.handleTaskSelect),
      
      // Handle template deletion - make sure all related tasks are removed
      eventBus.on('habit:template-delete', eventHandlers.handleTemplateDelete),
      
      // Handle habit checking
      eventBus.on('habits:check-pending', eventHandlers.handleHabitCheck),
      
      // Handle task dismissal
      eventBus.on('task:dismiss', eventHandlers.handleTaskDismiss),
    ];
    
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
      unsubscribers.forEach(unsub => unsub());
      window.removeEventListener('force-task-update', handleForceUpdate);
      window.removeEventListener('templates-tasks-cleaned', handleForceUpdate);
      verificationCleanup();
    };
  }, [
    dispatch, 
    forceTasksReload, 
    items, 
    eventHandlers, 
    lastForceUpdateTime, 
    setLastForceUpdateTime
  ]);
};
