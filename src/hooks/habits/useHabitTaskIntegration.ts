
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
import { MetricType, ActiveTemplate } from '@/types/habits/types';
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
        taskOperations.completeTask(habitTask.id, { value });
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
  
  /**
   * Check for missing habit tasks and create them
   */
  const checkForMissingHabitTasks = useCallback(() => {
    console.log('Checking for missing habit tasks...');
    
    // Get today's date string (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Get active templates and habits
    try {
      const templatesStr = localStorage.getItem('habit-templates');
      if (!templatesStr) return;
      
      const templates: ActiveTemplate[] = JSON.parse(templatesStr);
      if (!Array.isArray(templates)) return;
      
      // Check current day of week
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
      
      // Get existing tasks
      const tasksStr = localStorage.getItem('tasks');
      const tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];
      
      // Process each template that's active today
      templates.forEach(template => {
        if (!template.activeDays.includes(dayOfWeek as any)) return;
        
        // Process each habit in the template
        template.habits.forEach(habit => {
          // Generate key for this habit-date combination
          const key = `${habit.id}-${today}`;
          
          // Skip if already scheduled
          if (scheduledTasksRef.current.has(key)) return;
          
          // Check if task already exists
          const taskExists = tasks.some(task => 
            task.relationships?.habitId === habit.id && 
            task.relationships?.date === today
          );
          
          if (taskExists) {
            // Track existing task
            scheduledTasksRef.current.set(key, 'exists');
            return;
          }
          
          // Determine task type based on metric type
          let taskType: TaskType = 'regular';
          const metricType = habit.metrics?.type;
          
          if (metricType === 'timer') taskType = 'timer';
          else if (metricType === 'journal') taskType = 'journal';
          else if (metricType === 'counter') taskType = 'counter';
          else if (metricType === 'rating') taskType = 'rating';
          
          // Create task for this habit
          const taskId = taskOperations.createHabitTask(
            habit.id,
            template.templateId,
            habit.name,
            habit.metrics?.goal ? habit.metrics.goal * 60 : 1800, // Default 30 min or goal in seconds
            today,
            { 
              suppressToast: true,
              taskType,
              metricType: metricType as MetricType
            }
          );
          
          if (taskId) {
            scheduledTasksRef.current.set(key, taskId);
            console.log(`Created missing habit task ${taskId} for ${habit.name}`);
          }
        });
      });
    } catch (error) {
      console.error('Error checking for missing habit tasks:', error);
    }
  }, []);
  
  return {
    scheduledTasksRef,
    syncHabitsWithTasks,
    handleHabitSchedule,
    handleHabitComplete,
    checkForMissingHabitTasks
  };
};
