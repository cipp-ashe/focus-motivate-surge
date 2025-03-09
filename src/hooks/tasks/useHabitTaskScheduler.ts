
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
 * Hook for scheduling and managing habit tasks with improved reliability
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
  } = useHabitTaskProcessor();
  
  // Initialize the task cleanup handler
  const {
    handleTaskDelete,
    setupDailyCleanup
  } = useHabitTaskCleanup(tasks);
  
  // Initialize the task checker
  const {
    checkForMissingHabitTasks
  } = useHabitTaskChecker(tasks);

  // Setup event listener for habit scheduling with improved reliability
  useEffect(() => {
    console.log('Setting up habit task scheduler with improved reliability');
    
    // Subscribe to habit:schedule events
    const unsubscribeSchedule = eventBus.on('habit:schedule', handleHabitSchedule);
    
    // Set up daily cleanup
    const cleanupTimeoutId = setupDailyCleanup();
    
    // Process any pending habits when component mounts with staggered timing
    const timeouts: NodeJS.Timeout[] = [];
    
    // Initial check
    timeouts.push(setTimeout(() => {
      eventBus.emit('habits:check-pending', {});
      console.log('Checking for pending habits on task scheduler mount (initial)');
    }, 300));
    
    // Process any pending tasks
    timeouts.push(setTimeout(() => {
      processPendingTasks();
      console.log('Processing pending tasks (initial)');
    }, 600));
    
    // Additional verification check
    timeouts.push(setTimeout(() => {
      checkForMissingHabitTasks();
      console.log('Verifying all habit tasks are loaded (initial)');
    }, 1200));
    
    return () => {
      // Clean up subscriptions
      unsubscribeSchedule();
      
      // Clear all timeouts
      timeouts.forEach(timeout => clearTimeout(timeout));
      
      // Clear the cleanup timeout
      if (cleanupTimeoutId) {
        clearTimeout(cleanupTimeoutId);
      }
    };
  }, [
    handleHabitSchedule, 
    setupDailyCleanup, 
    clearAllTrackedTasks, 
    processPendingTasks,
    checkForMissingHabitTasks
  ]);

  // Setup task deletion listener
  useEffect(() => {
    const unsubscribeTaskDelete = eventBus.on('task:delete', handleTaskDelete);
    
    return () => {
      unsubscribeTaskDelete();
    };
  }, [handleTaskDelete]);

  // Return the public API
  return { 
    scheduledTasksRef,
    checkForMissingHabitTasks 
  };
};
