
import { useRef, useCallback } from 'react';

/**
 * Hook for tracking scheduled habit tasks
 */
export const useHabitTaskTracker = () => {
  // Reference to store tracked tasks
  const scheduledTasksRef = useRef<Record<string, any>>({});
  
  // Clear all tracked tasks
  const clearAllTrackedTasks = useCallback(() => {
    console.log('Clearing all tracked habit tasks');
    scheduledTasksRef.current = {};
  }, []);
  
  // Add a task to tracking
  const trackTask = useCallback((habitId: string, date: string, taskId: string) => {
    const key = `${habitId}-${date}`;
    scheduledTasksRef.current[key] = taskId;
    console.log(`Tracking habit task: ${habitId} on ${date} with taskId ${taskId}`);
  }, []);
  
  // Check if a task is already tracked
  const isTaskTracked = useCallback((habitId: string, date: string) => {
    const key = `${habitId}-${date}`;
    return !!scheduledTasksRef.current[key];
  }, []);
  
  // Get a tracked task ID
  const getTrackedTaskId = useCallback((habitId: string, date: string) => {
    const key = `${habitId}-${date}`;
    return scheduledTasksRef.current[key];
  }, []);
  
  return {
    scheduledTasksRef,
    clearAllTrackedTasks,
    trackTask,
    isTaskTracked,
    getTrackedTaskId
  };
};
