
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { HabitTaskEvent } from './types';
import { useHabitTaskTracker } from './useHabitTaskTracker';
import { useTaskVerification } from './useTaskVerification';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { eventBus } from '@/lib/eventBus';
import { useTaskEvents } from '../useTaskEvents';

/**
 * Hook to process habit task events
 */
export const useHabitTaskProcessor = (tasks: Task[]) => {
  const taskTracker = useHabitTaskTracker();
  const { checkTaskExistsInMemory, checkTaskExistsInStorage } = useTaskVerification(tasks);
  const { createHabitTask } = useHabitTaskCreator();
  const { forceTaskUpdate } = useTaskEvents();
  
  /**
   * Process any pending tasks that failed to schedule earlier
   */
  const processPendingTasks = useCallback(() => {
    const pendingTasks = taskTracker.getPendingTasks();
    if (pendingTasks.length === 0) return;
    
    console.log(`Processing ${pendingTasks.length} pending habit tasks`);
    
    // Process each task
    pendingTasks.forEach(event => {
      eventBus.emit('habit:schedule', event);
    });
  }, [taskTracker]);
  
  /**
   * Handle habit scheduling events
   */
  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    // Prevent concurrent processing of events
    if (taskTracker.isProcessing()) {
      console.log('TaskScheduler: Already processing a habit:schedule event, queuing for later');
      taskTracker.queuePendingTask(event);
      setTimeout(() => processPendingTasks(), 300);
      return;
    }
    
    taskTracker.setProcessingState(true);
    
    try {
      const { habitId, templateId, name, duration, date } = event;
      
      console.log('TaskScheduler received habit:schedule event:', event);
      
      // Create a unique key to track this scheduled task
      const taskKey = `${habitId}-${date}`;
      
      // Check if we've already processed this exact habit-date combination
      const existingTaskId = taskTracker.isTaskTracked(habitId, date);
      if (existingTaskId) {
        console.log(`Task already scheduled for habit ${habitId} on ${date}, taskId: ${existingTaskId}`);
        
        // Verify the task actually exists and force update if needed
        const taskExists = checkTaskExistsInStorage(habitId, date);
        if (!taskExists) {
          console.log(`Tracked task ${existingTaskId} not found in storage, recreating`);
          taskTracker.removeTrackedTask(habitId, date);
          // Continue execution to recreate the task
        } else {
          taskTracker.setProcessingState(false);
          return;
        }
      }
      
      // Check in memory task list
      const existingTaskInMemory = checkTaskExistsInMemory(habitId, date);
      
      if (existingTaskInMemory) {
        console.log(`Task already exists in memory for habit ${habitId} on ${date}:`, existingTaskInMemory);
        taskTracker.trackTask(habitId, date, existingTaskInMemory.id);
        taskTracker.setProcessingState(false);
        return;
      }
      
      // Also check localStorage directly
      const existingTaskInStorage = checkTaskExistsInStorage(habitId, date);
      
      if (existingTaskInStorage) {
        console.log(`Task already exists in localStorage for habit ${habitId} on ${date}:`, existingTaskInStorage);
        taskTracker.trackTask(habitId, date, existingTaskInStorage.id);
        
        // Force a task update to ensure the task is loaded
        setTimeout(() => forceTaskUpdate(), 100);
        
        taskTracker.setProcessingState(false);
        return;
      }

      // Create the habit task and get its ID
      const taskId = createHabitTask(habitId, templateId, name, duration, date);
      console.log(`Created new habit task with ID: ${taskId}`);
      
      // Add to our tracking map
      taskTracker.trackTask(habitId, date, taskId);
      
      // Force a task update to make sure UI reflects the new task
      setTimeout(() => forceTaskUpdate(), 200);
      
    } finally {
      // Release the lock after a short delay to prevent race conditions
      setTimeout(() => {
        taskTracker.setProcessingState(false);
        
        // Process any tasks that came in while we were busy
        const pendingTasks = taskTracker.getPendingTasks();
        if (pendingTasks.length > 0) {
          processPendingTasks();
        }
      }, 100);
    }
  }, [taskTracker, checkTaskExistsInMemory, checkTaskExistsInStorage, createHabitTask, forceTaskUpdate, processPendingTasks]);
  
  return {
    handleHabitSchedule,
    processPendingTasks
  };
};
