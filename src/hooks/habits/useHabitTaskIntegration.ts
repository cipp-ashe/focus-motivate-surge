
/**
 * Unified Hook for Habit-Task Integration
 * 
 * This hook consolidates the habit-task integration functionality
 * that was previously scattered across multiple hooks.
 */

import { useCallback, useRef, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { taskOperations } from '@/lib/operations/tasks';
import { useEvent } from '@/hooks/useEvent';
import { MetricType, ActiveTemplate } from '@/types/habits';
import { HabitTaskEvent } from '@/types/events/habit-events';
import { Task, TaskType } from '@/types/tasks';

export const useHabitTaskIntegration = () => {
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
      // Map metric type to task type
      let taskType: TaskType = 'regular';
      if (metricType === 'timer') taskType = 'timer';
      else if (metricType === 'journal') taskType = 'journal';
      else if (metricType === 'counter') taskType = 'counter';
      else if (metricType === 'rating') taskType = 'rating';
      
      // Create the habit task
      const taskId = taskOperations.createHabitTask(
        habitId,
        templateId,
        name,
        duration,
        date,
        { 
          suppressToast: true,
          taskType,
          metricType
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
  
  // Set up event listeners
  useEvent('habit:schedule', handleHabitSchedule);
  
  // Sync habits with tasks
  const syncHabitsWithTasks = useCallback((templates?: ActiveTemplate[]) => {
    console.log('Syncing habits with tasks...');
    
    // Check for missing habit tasks
    eventManager.emit('habits:check-pending', {});
    
    // Force task update
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 100);
    
    return true;
  }, []);
  
  // Handle habit completion events
  const handleHabitComplete = useCallback((payload: any) => {
    const { habitId, date, value, metricType, habitName, templateId } = payload;
    console.log(`Handling habit completion for ${habitId} on ${date} with value:`, value);
    
    // For journal habit completion, we need special handling
    if (metricType === 'journal') {
      // Emit journal open event
      eventManager.emit('journal:open', {
        habitId,
        habitName: habitName || 'Journal Entry',
        date,
        templateId
      });
    }
    
    // Mark corresponding task as completed if it exists
    const findAndCompleteHabitTask = (tasks: Task[]) => {
      const habitTask = tasks.find(task => 
        task.relationships?.habitId === habitId && 
        task.relationships?.date === date
      );
      
      if (habitTask && !habitTask.completed) {
        taskOperations.completeTask(habitTask.id);
      }
    };
    
    // Get tasks and find the matching habit task
    const tasksStr = localStorage.getItem('tasks');
    if (tasksStr) {
      try {
        const tasks = JSON.parse(tasksStr);
        if (Array.isArray(tasks)) {
          findAndCompleteHabitTask(tasks);
        }
      } catch (e) {
        console.error('Error parsing tasks:', e);
      }
    }
  }, []);
  
  // Set up event listeners for habit completion
  useEffect(() => {
    const unsubscribe = eventManager.on('habit:complete', handleHabitComplete);
    return unsubscribe;
  }, [handleHabitComplete]);
  
  return {
    scheduledTasksRef,
    syncHabitsWithTasks,
    handleHabitSchedule,
    handleHabitComplete
  };
};
