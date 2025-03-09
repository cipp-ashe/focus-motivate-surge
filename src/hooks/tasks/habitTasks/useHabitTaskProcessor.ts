
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { HabitTaskEvent } from './types';
import { useHabitTaskTracker } from './useHabitTaskTracker';
import { useTaskVerification } from './useTaskVerification';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { eventBus } from '@/lib/eventBus';
import { useTaskEvents } from '../useTaskEvents';
import { toast } from 'sonner';

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
          // The task exists in storage, verify it's loaded in memory
          const existsInMemory = checkTaskExistsInMemory(habitId, date);
          if (!existsInMemory) {
            console.log(`Task exists in storage but not in memory, forcing reload`);
            setTimeout(() => forceTaskUpdate(), 100);
          }
          
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
        
        // Force a task update to ensure the task is loaded into memory
        setTimeout(() => {
          forceTaskUpdate();
          // Add an explicit toast notification to confirm task was found
          toast.info(`Found existing habit task: ${name}`);
        }, 100);
        
        taskTracker.setProcessingState(false);
        return;
      }

      // Create the habit task and get its ID
      const taskId = createHabitTask(habitId, templateId, name, duration, date);
      console.log(`Created new habit task with ID: ${taskId}`);
      
      // Add to our tracking map
      taskTracker.trackTask(habitId, date, taskId);
      
      // Force a task update to make sure UI reflects the new task - multiple times with increasing delays
      const updateIntervals = [100, 300, 800];
      updateIntervals.forEach(delay => {
        setTimeout(() => {
          console.log(`Force updating tasks after ${delay}ms`);
          forceTaskUpdate();
          
          // Explicitly check if the task exists after update
          if (delay === updateIntervals[updateIntervals.length - 1]) {
            setTimeout(() => {
              const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
              const taskExists = storedTasks.some((t: Task) => 
                t.relationships?.habitId === habitId && t.relationships?.date === date
              );
              
              if (!taskExists) {
                console.log(`Task still missing from localStorage after updates, final attempt to recreate`);
                // Final attempt to create the task directly in localStorage
                const task: Task = {
                  id: taskId,
                  name,
                  completed: false,
                  duration: typeof duration === 'number' ? duration : 1500,
                  createdAt: new Date().toISOString(),
                  relationships: {
                    habitId,
                    templateId,
                    date
                  }
                };
                
                storedTasks.push(task);
                localStorage.setItem('taskList', JSON.stringify(storedTasks));
                
                // Force one more task update
                setTimeout(() => forceTaskUpdate(), 100);
              }
            }, 200);
          }
        }, delay);
      });
      
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
