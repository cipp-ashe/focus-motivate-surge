
import { useEffect, useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { 
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker,
  HabitTaskSchedulerReturn
} from './habitTasks';

/**
 * Hook for scheduling and managing habit tasks
 */
export const useHabitTaskScheduler = (tasks: Task[]): HabitTaskSchedulerReturn => {
  // Initialize the task tracker
  const {
    scheduledTasksRef,
    clearAllTrackedTasks
  } = useHabitTaskTracker();
  
  // Initialize the task processor
  const {
    handleHabitSchedule,
    processPendingTasks
  } = useHabitTaskProcessor(tasks);
  
  // Initialize the task cleanup handler
  const {
    handleTaskDelete,
    setupDailyCleanup
  } = useHabitTaskCleanup(tasks);
  
  // Initialize the task checker
  const {
    checkForMissingHabitTasks
  } = useHabitTaskChecker(tasks);

  // Setup event listener for habit scheduling
  useEffect(() => {
    const unsubscribeSchedule = eventBus.on('habit:schedule', handleHabitSchedule);
    
    // Set up daily cleanup
    const cleanupTimeout = setupDailyCleanup(clearAllTrackedTasks);
    
    // Also check for pending habits when component mounts
    const timeout = setTimeout(() => {
      eventBus.emit('habits:check-pending', {});
      console.log('Checking for pending habits on task scheduler mount');
      
      // Process any pending tasks
      processPendingTasks();
    }, 500);
    
    return () => {
      unsubscribeSchedule();
      clearTimeout(timeout);
      clearTimeout(cleanupTimeout);
    };
  }, [handleHabitSchedule, setupDailyCleanup, clearAllTrackedTasks, processPendingTasks]);

  // Setup task deletion listener
  useEffect(() => {
    const unsubscribeTaskDelete = eventBus.on('task:delete', handleTaskDelete);
    
    return () => {
      unsubscribeTaskDelete();
    };
  }, [handleTaskDelete]);

  return { 
    scheduledTasksRef,
    checkForMissingHabitTasks 
  };
};
