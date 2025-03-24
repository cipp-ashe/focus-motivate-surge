
/**
 * Unified Hook for Habit-Task Integration
 * 
 * This hook consolidates the habit-task integration functionality
 * using the new unified type system.
 */

import { useCallback, useRef, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useTaskCreation } from '@/hooks/tasks/useTaskCreation';
import { useEvent } from '@/hooks/useEvent';
import { Task, TaskType } from '@/types/tasks';
import { HabitDetail, ActiveTemplate } from '@/types/habits/unified';

interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  trackingType: TaskType;
}

export const useHabitTaskIntegration = () => {
  // Reference to task creation utilities
  const { createHabitTask } = useTaskCreation();
  
  // Track which habit tasks have been scheduled to avoid duplicates
  const scheduledTasksRef = useRef<Map<string, string>>(new Map());
  
  // Handle habit schedule events
  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    const { habitId, templateId, name, duration, date, trackingType } = event;
    
    // Generate a unique key for this habit-date combination
    const key = `${habitId}-${date}`;
    
    // Check if we've already scheduled this task
    if (scheduledTasksRef.current.has(key)) {
      console.log(`Already scheduled task for habit ${habitId} on ${date}, skipping`);
      return scheduledTasksRef.current.get(key);
    }
    
    try {
      // Create the habit task with the appropriate tracking type
      const taskId = createHabitTask(
        habitId,
        name,
        trackingType,
        templateId,
        date,
        { 
          suppressToast: true,
          duration
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
  }, [createHabitTask]);
  
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
    const { habitId, date, value, trackingType, habitName, templateId } = payload;
    console.log(`Handling habit completion for ${habitId} on ${date} with value:`, value);
    
    // For journal habit completion, we need special handling
    if (trackingType === 'journal') {
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
        eventManager.emit('task:complete', { 
          taskId: habitTask.id,
          value
        });
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
          
          // Create task for this habit
          const trackingType = habit.metrics?.trackingType || 'regular';
          createHabitTask(
            habit.id,
            habit.name,
            trackingType,
            template.templateId,
            today,
            { 
              suppressToast: true,
              duration: 0
            }
          );
          
          console.log(`Created missing habit task for ${habit.name}`);
        });
      });
    } catch (error) {
      console.error('Error checking for missing habit tasks:', error);
    }
  }, [createHabitTask]);
  
  return {
    scheduledTasksRef,
    syncHabitsWithTasks,
    handleHabitSchedule,
    handleHabitComplete,
    checkForMissingHabitTasks
  };
};
