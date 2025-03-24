
import { useCallback, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { EventType } from '@/types/events';
import { useTaskCreationHandler } from './useTaskCreationHandler';
import { useHabitVerification } from './useHabitVerification';

/**
 * Hook for handling task-related events in the TaskContext
 */
export const useTaskEvents = (
  items: Task[],
  completed: Task[],
  dispatch: React.Dispatch<any>
) => {
  const [pendingTaskUpdates, setPendingTaskUpdates] = useState<Task[]>([]);
  const [lastEventTimes, setLastEventTimes] = useState<Record<string, number>>({});
  
  // Event deduplication utility
  const shouldProcessEvent = useCallback((eventType: string, minDelay = 300): boolean => {
    const now = Date.now();
    const lastTime = lastEventTimes[eventType] || 0;
    
    if (now - lastTime < minDelay) {
      console.log(`TaskEvents: Skipping ${eventType}, too frequent`);
      return false;
    }
    
    setLastEventTimes(prev => ({ ...prev, [eventType]: now }));
    return true;
  }, [lastEventTimes]);
  
  // Set up event handlers
  const { handleTaskCreate } = useTaskCreationHandler(items, dispatch, setPendingTaskUpdates);
  const { handleHabitCheck } = useHabitVerification(items, dispatch, shouldProcessEvent);
  
  // Handle task completion
  const handleTaskComplete = useCallback((payload: { taskId: string, metrics?: any }) => {
    if (!shouldProcessEvent('task:complete')) return;
    
    console.log("TaskEvents: Completing task", payload.taskId);
    dispatch({ type: 'COMPLETE_TASK', payload });
  }, [dispatch, shouldProcessEvent]);
  
  // Handle task deletion
  const handleTaskDelete = useCallback((payload: { taskId: string, reason?: string }) => {
    if (!shouldProcessEvent('task:delete')) return;
    
    console.log("TaskEvents: Deleting task", payload.taskId);
    dispatch({ type: 'DELETE_TASK', payload });
  }, [dispatch, shouldProcessEvent]);
  
  // Handle task updates
  const handleTaskUpdate = useCallback((payload: { taskId: string, updates: any }) => {
    if (!shouldProcessEvent('task:update')) return;
    
    console.log("TaskEvents: Updating task", payload.taskId);
    dispatch({ type: 'UPDATE_TASK', payload });
  }, [dispatch, shouldProcessEvent]);
  
  // Handle task selection
  const handleTaskSelect = useCallback((taskId: string) => {
    if (!shouldProcessEvent('task:select', 100)) return;
    
    console.log("TaskEvents: Selecting task", taskId);
    dispatch({ type: 'SELECT_TASK', payload: taskId });
  }, [dispatch, shouldProcessEvent]);
  
  // Handle template deletion (affects related tasks)
  const handleTemplateDelete = useCallback((payload: { templateId: string, isOriginatingAction?: boolean }) => {
    if (!shouldProcessEvent('habit:template-delete')) return;
    
    console.log("TaskEvents: Template deleted, checking related tasks", payload.templateId);
    // No direct dispatch - we'll let task verification handle this
    window.dispatchEvent(new Event('templates-tasks-cleaned'));
  }, [shouldProcessEvent]);
  
  // Handle task dismissal
  const handleTaskDismiss = useCallback((payload: { taskId: string, habitId?: string, date?: string }) => {
    if (!shouldProcessEvent('task:dismiss')) return;
    
    console.log("TaskEvents: Dismissing task", payload.taskId);
    dispatch({ type: 'DELETE_TASK', payload: { taskId: payload.taskId, reason: 'dismissed' } });
  }, [dispatch, shouldProcessEvent]);
  
  // Force reload of tasks from storage
  const forceTasksReload = useCallback(() => {
    console.log('TaskEvents: Forcing task reload');
    // Implementation depends on TaskContext specifics
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    // Set up listeners for each event type
    const createUnsubscribe = eventManager.on('task:create', handleTaskCreate);
    const updateUnsubscribe = eventManager.on('task:update', handleTaskUpdate);
    const deleteUnsubscribe = eventManager.on('task:delete', handleTaskDelete);
    const completeUnsubscribe = eventManager.on('task:complete', handleTaskComplete);
    const selectUnsubscribe = eventManager.on('task:select', handleTaskSelect);
    const templateDeleteUnsubscribe = eventManager.on('habit:template-delete', handleTemplateDelete);
    const habitCheckUnsubscribe = eventManager.on('habits:check-pending', handleHabitCheck);
    const taskDismissUnsubscribe = eventManager.on('task:dismiss', handleTaskDismiss);
    
    // Clean up listeners on unmount
    return () => {
      createUnsubscribe();
      updateUnsubscribe();
      deleteUnsubscribe();
      completeUnsubscribe();
      selectUnsubscribe();
      templateDeleteUnsubscribe();
      habitCheckUnsubscribe();
      taskDismissUnsubscribe();
    };
  }, [
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
    handleTaskComplete,
    handleTaskSelect,
    handleTemplateDelete,
    handleHabitCheck,
    handleTaskDismiss
  ]);
  
  return { 
    forceTasksReload,
    eventHandlers: {
      handleTaskCreate,
      handleTaskComplete,
      handleTaskDelete,
      handleTaskUpdate,
      handleTaskSelect,
      handleTemplateDelete,
      handleHabitCheck,
      handleTaskDismiss
    }
  };
};
