
import { useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { 
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker
} from './habitTasks';

/**
 * Hook for scheduling and managing habit tasks with improved reliability
 */
export const useHabitTaskScheduler = (tasks: Task[]) => {
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
  // Note: destructuring only the deleteHabitTask function we have
  const {
    deleteHabitTask
  } = useHabitTaskCleanup();
  
  // Initialize the task checker
  const {
    checkForMissingHabitTasks
  } = useHabitTaskChecker();

  // Handle task deletion - implementing this here since it's not provided by useHabitTaskCleanup
  const handleTaskDelete = useCallback((event: { taskId: string; reason?: string }) => {
    console.log('Task deletion detected:', event);
    // Additional logic can be added here if needed
  }, []);
  
  // Setup daily cleanup function
  const setupDailyCleanup = useCallback(() => {
    console.log('Setting up daily habit task cleanup');
    
    // Calculate time until next cleanup (e.g., midnight)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Schedule cleanup
    const timeoutId = setTimeout(() => {
      console.log('Running scheduled habit task cleanup');
      // Implement cleanup logic here
    }, timeUntilMidnight);
    
    return timeoutId;
  }, []);

  // Setup event listener for habit scheduling with improved reliability
  useEffect(() => {
    console.log('Setting up habit task scheduler with improved reliability');
    
    // Set up event listeners using the eventManager
    const unsubscribeSchedule = eventManager.on('habit:schedule', handleHabitSchedule);
    
    // Set up daily cleanup
    const cleanupTimeoutId = setupDailyCleanup();
    
    // Process any pending habits when component mounts with staggered timing
    const timeouts: NodeJS.Timeout[] = [];
    
    // Initial check
    timeouts.push(setTimeout(() => {
      eventManager.emit('habits:check-pending', {});
      console.log('Checking for pending habits on task scheduler mount (initial)');
    }, 300));
    
    // Process any pending tasks
    timeouts.push(setTimeout(() => {
      processPendingTasks();
      console.log('Processing pending tasks (initial)');
    }, 600));
    
    // Additional verification check - pass without tasks param since it's not needed
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
    const unsubscribeTaskDelete = eventManager.on('task:delete', handleTaskDelete);
    
    return () => {
      unsubscribeTaskDelete();
    };
  }, [handleTaskDelete]);

  // Return the public API
  return { 
    scheduledTasksRef,
    checkForMissingHabitTasks,
    deleteHabitTask
  };
};
