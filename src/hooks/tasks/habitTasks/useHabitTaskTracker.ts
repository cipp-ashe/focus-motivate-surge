
import { useRef, useCallback } from 'react';
import { Task } from '@/types/tasks';

/**
 * Hook to track scheduled habit tasks
 */
export const useHabitTaskTracker = () => {
  // Map habitId-date to taskId
  const scheduledTasksRef = useRef(new Map<string, string>());
  
  // Track processing state to prevent concurrent processing
  const processingEventRef = useRef(false);
  
  // Track pending tasks that couldn't be processed immediately
  const pendingTasksRef = useRef<any[]>([]);
  
  const trackTask = useCallback((habitId: string, date: string, taskId: string) => {
    const taskKey = `${habitId}-${date}`;
    scheduledTasksRef.current.set(taskKey, taskId);
  }, []);
  
  const isTaskTracked = useCallback((habitId: string, date: string): string | null => {
    const taskKey = `${habitId}-${date}`;
    const taskId = scheduledTasksRef.current.get(taskKey);
    return taskId || null;
  }, []);
  
  const removeTrackedTask = useCallback((habitId: string, date: string) => {
    const taskKey = `${habitId}-${date}`;
    if (scheduledTasksRef.current.has(taskKey)) {
      scheduledTasksRef.current.delete(taskKey);
      return true;
    }
    return false;
  }, []);
  
  const clearAllTrackedTasks = useCallback(() => {
    scheduledTasksRef.current.clear();
  }, []);
  
  const queuePendingTask = useCallback((task: any) => {
    pendingTasksRef.current.push(task);
  }, []);
  
  const getPendingTasks = useCallback(() => {
    const tasks = [...pendingTasksRef.current];
    pendingTasksRef.current = [];
    return tasks;
  }, []);
  
  const setProcessingState = useCallback((isProcessing: boolean) => {
    processingEventRef.current = isProcessing;
  }, []);
  
  const isProcessing = useCallback(() => {
    return processingEventRef.current;
  }, []);
  
  return {
    trackTask,
    isTaskTracked,
    removeTrackedTask,
    clearAllTrackedTasks,
    queuePendingTask,
    getPendingTasks,
    setProcessingState,
    isProcessing,
    scheduledTasksRef
  };
};
