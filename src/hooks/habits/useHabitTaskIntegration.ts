
/**
 * Streamlined Hook for Habit Task Integration
 * 
 * This hook provides a focused API for integrating habits with tasks.
 */

import { useCallback, useRef, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useEvent } from '@/hooks/useEvent';
import { MetricType } from '@/types/habits/types';
import { Task, TaskType } from '@/types/tasks';
import { HabitTaskOptions, HabitTaskIntegrationReturn } from '@/types/habits/taskIntegration';
import { HabitTaskEvent } from '@/types/events';

export const useHabitTaskIntegration = (): HabitTaskIntegrationReturn => {
  // Track which habit tasks have been scheduled to avoid duplicates
  const scheduledTasksRef = useRef<Map<string, string>>(new Map());
  
  /**
   * Create a habit task
   */
  const createHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    date: string,
    duration: number = 1800, // Default 30 minutes
    options?: HabitTaskOptions
  ) => {
    console.log(`Creating task for habit ${habitId}, template ${templateId}`);
    
    // Determine task type based on metric type
    let taskType: TaskType = 'habit';
    
    if (options?.metricType === 'journal') {
      taskType = 'journal';
    } else if (options?.metricType === 'timer') {
      taskType = 'timer';
    } else if (options?.taskType) {
      taskType = options.taskType;
    }
    
    const taskId = `habit-${habitId}-${date}`;
    
    const newTask: Task = {
      id: taskId,
      name,
      description: `Task for habit on ${date}`,
      taskType,
      completed: false,
      duration,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId,
        templateId,
        date,
        metricType: options?.metricType
      }
    };
    
    // Emit event to create the task
    eventManager.emit('task:create', newTask);
    
    // Optionally select the task after creation
    if (options?.selectAfterCreate) {
      eventManager.emit('task:select', newTask.id);
    }
    
    return taskId;
  }, []);
  
  /**
   * Handle habit schedule events
   */
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
        { 
          suppressToast: true,
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
  }, [createHabitTask]);
  
  /**
   * Handle habit completion events
   */
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
        eventManager.emit('task:complete', { 
          taskId: habitTask.id,
          metrics: { value }
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
      
      const templates = JSON.parse(templatesStr);
      if (!Array.isArray(templates)) return;
      
      // Check current day of week
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
      
      // Get existing tasks
      const tasksStr = localStorage.getItem('tasks');
      const tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];
      
      // Process each template that's active today
      templates.forEach(template => {
        if (!template.activeDays.includes(dayOfWeek)) return;
        
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
          
          // Determine task type and duration based on metric type
          let taskType: TaskType = 'regular';
          let duration = 1800; // Default 30 min
          
          const metricType = habit.metrics?.type;
          
          if (metricType === 'timer') {
            taskType = 'timer';
            duration = habit.metrics?.goal ? habit.metrics.goal * 60 : 1800;
          } else if (metricType === 'journal') {
            taskType = 'journal';
          } else if (metricType === 'counter') {
            taskType = 'counter';
          } else if (metricType === 'rating') {
            taskType = 'rating';
          }
          
          // Create task for this habit
          const taskId = createHabitTask(
            habit.id,
            template.templateId,
            habit.name,
            today,
            duration,
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
  }, [createHabitTask]);
  
  /**
   * Sync habits with tasks
   */
  const syncHabitsWithTasks = useCallback(() => {
    console.log('Syncing habits with tasks...');
    
    // Check for missing habit tasks
    checkForMissingHabitTasks();
    
    // Force task update
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 100);
    
    return true;
  }, [checkForMissingHabitTasks]);
  
  // Set up event listeners
  useEvent('habit:schedule', handleHabitSchedule);
  useEffect(() => {
    const unsubscribe = eventManager.on('habit:complete', handleHabitComplete);
    return unsubscribe;
  }, [handleHabitComplete]);
  
  return {
    scheduledTasksRef,
    createHabitTask,
    handleHabitSchedule,
    handleHabitComplete,
    syncHabitsWithTasks,
    checkForMissingHabitTasks
  };
};
