
import { useCallback, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { HabitTaskEvent, HabitTaskSchedulerReturn } from './types';
import { useEvent } from '@/hooks/useEvent';
import { useHabitTaskCreator } from './useHabitTaskCreator';

/**
 * Hook for scheduling habit tasks with proper error handling
 */
export const useHabitTaskScheduler = (): HabitTaskSchedulerReturn => {
  // Track which habit tasks have been scheduled to avoid duplicates
  const scheduledTasksRef = useRef<Map<string, string>>(new Map());
  const { createHabitTask } = useHabitTaskCreator();
  
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
      const taskId = createHabitTask(
        habitId,
        templateId,
        name,
        date,
        duration,
        { metricType }
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
  }, [createHabitTask]);
  
  // Check for missing habit tasks
  const checkForMissingHabitTasks = useCallback(() => {
    console.log('Checking for missing habit tasks...');
    
    // For now, just emit the check pending event
    // Actual implementation would involve checking local storage
    eventManager.emit('habits:check-pending', {});
  }, []);
  
  // Listen for 'habit:schedule' events
  useEvent('habit:schedule', handleHabitSchedule);
  
  return {
    scheduledTasksRef,
    handleHabitSchedule,
    checkForMissingHabitTasks
  };
};
