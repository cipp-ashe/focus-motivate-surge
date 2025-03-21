
import { useEffect, useCallback, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { taskOperations } from '@/lib/operations/taskOperations';
import { HabitTaskEvent, HabitTaskSchedulerReturn } from './types';
import { useEvent } from '@/hooks/useEvent';

/**
 * Hook for scheduling habit tasks with proper error handling
 */
export const useHabitTaskScheduler = (): HabitTaskSchedulerReturn => {
  // Track which habit tasks have been scheduled to avoid duplicates
  const scheduledTasksRef = useRef<Map<string, string>>(new Map());
  
  // Handle habit schedule events
  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    const { habitId, templateId, name, duration, date, metricType } = event;
    
    // Generate a unique key for this habit-date combination
    const key = `${habitId}-${date}`;
    
    // Check if we've already scheduled this task
    if (scheduledTasksRef.current.has(key)) {
      console.log(`Already scheduled task for habit ${habitId} on ${date}, skipping`);
      return scheduledTasksRef.current.get(key);
    }
    
    try {
      // Create the habit task
      const taskId = taskOperations.createHabitTask(
        habitId,
        templateId,
        name,
        duration,
        date,
        { 
          suppressToast: true,
          taskType: metricType === 'timer' ? 'timer' : 
                    metricType === 'journal' ? 'journal' : 'regular'
        }
      );
      
      if (taskId) {
        // Track that we've scheduled this task
        scheduledTasksRef.current.set(key, taskId);
        console.log(`Scheduled task ${taskId} for habit ${habitId} on ${date}`);
      }
      
      return taskId;
    } catch (error) {
      console.error('Error scheduling habit task:', error);
      return null;
    }
  }, []);
  
  // Set up event listeners with the new system
  useEvent('habit:schedule', handleHabitSchedule);
  
  // Check for missing habit tasks
  const checkForMissingHabitTasks = useCallback(() => {
    // Emit event to check pending habit tasks
    eventManager.emit('habits:check-pending', {});
    
    // Force task update
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 100);
  }, []);
  
  return {
    scheduledTasksRef,
    checkForMissingHabitTasks
  };
};
