
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { useEventDebounce } from './events/useEventDebounce';
import { useTaskReload } from './events/useTaskReload';
import { useTaskCreationHandler } from './events/useTaskCreationHandler';
import { useTaskUpdateHandler } from './events/useTaskUpdateHandler';
import { useTemplateHandler } from './events/useTemplateHandler';
import { useHabitVerification } from './events/useHabitVerification';
import { useTaskEventListeners } from './events/useTaskEventListeners';

/**
 * Hook for handling task-related events with improved error handling, synchronization and verification
 */
export const useTaskEvents = (
  items: Task[],
  completed: Task[],
  dispatch: React.Dispatch<any>
) => {
  // Set up debouncing system
  const {
    lastEventTime,
    setLastEventTime,
    lastForceUpdateTime,
    setLastForceUpdateTime,
    shouldProcessEvent
  } = useEventDebounce();
  
  // Set up task reload system
  const {
    pendingTaskUpdates,
    setPendingTaskUpdates,
    forceTasksReload: baseForceTasksReload
  } = useTaskReload(dispatch);
  
  // Create a wrapped version of forceTasksReload that includes the debounce state
  const forceTasksReload = useCallback(() => {
    baseForceTasksReload(lastEventTime, setLastEventTime);
  }, [baseForceTasksReload, lastEventTime, setLastEventTime]);
  
  // Set up task event handlers
  const { handleTaskCreate } = useTaskCreationHandler(
    items, 
    dispatch, 
    setPendingTaskUpdates
  );
  
  const {
    handleTaskComplete,
    handleTaskDelete,
    handleTaskUpdate,
    handleTaskSelect
  } = useTaskUpdateHandler(dispatch);
  
  const { handleTemplateDelete } = useTemplateHandler(dispatch);
  
  const { handleHabitCheck } = useHabitVerification(
    items,
    dispatch,
    shouldProcessEvent
  );
  
  // Set up event listeners
  useTaskEventListeners(
    items,
    dispatch,
    {
      handleTaskCreate,
      handleTaskComplete,
      handleTaskDelete,
      handleTaskUpdate,
      handleTaskSelect,
      handleTemplateDelete,
      handleHabitCheck
    },
    forceTasksReload,
    lastForceUpdateTime,
    setLastForceUpdateTime
  );
  
  // Provide the reload function
  return { forceTasksReload };
};
