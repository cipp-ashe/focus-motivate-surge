
import { useRef, useCallback, useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { useTagSystem } from '@/hooks/useTagSystem';
import { Task } from '@/types/tasks';
import { useTaskEvents } from './useTaskEvents';

interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
}

export const useHabitTaskScheduler = (tasks: Task[]) => {
  const { addTagToEntity } = useTagSystem();
  const { createTask, forceTaskUpdate } = useTaskEvents();
  const scheduledTasksRef = useRef(new Map<string, string>()); // Map habitId-date to taskId
  const processingEventRef = useRef(false);

  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    // Prevent concurrent processing of events
    if (processingEventRef.current) {
      console.log('TaskScheduler: Already processing a habit:schedule event, deferring');
      setTimeout(() => eventBus.emit('habit:schedule', event), 100);
      return;
    }
    
    processingEventRef.current = true;
    
    try {
      const { habitId, templateId, name, duration, date } = event;
      
      console.log('TaskScheduler received habit:schedule event:', event);
      
      // Create a unique key to track this scheduled task
      const taskKey = `${habitId}-${date}`;
      
      // Check if we've already processed this exact habit-date combination
      if (scheduledTasksRef.current.has(taskKey)) {
        const existingTaskId = scheduledTasksRef.current.get(taskKey);
        console.log(`Task already scheduled for habit ${habitId} on ${date}, taskId: ${existingTaskId}`);
        processingEventRef.current = false;
        return;
      }
      
      // Check if task already exists for this habit and date
      const existingTask = tasks.find(task => 
        task.relationships?.habitId === habitId && 
        task.relationships?.date === date
      );
      
      if (existingTask) {
        console.log(`Task already exists for habit ${habitId} on ${date}:`, existingTask);
        scheduledTasksRef.current.set(taskKey, existingTask.id);
        processingEventRef.current = false;
        return;
      }

      const taskId = crypto.randomUUID();
      console.log(`Creating new task for habit ${habitId}:`, { taskId, name, duration });
      
      // Add to our tracking map
      scheduledTasksRef.current.set(taskKey, taskId);
      
      // Ensure we're storing the duration in seconds
      const durationInSeconds = typeof duration === 'number' ? duration : 1500;
      
      const task: Task = {
        id: taskId,
        name,
        completed: false,
        duration: durationInSeconds, // Store in seconds
        createdAt: new Date().toISOString(),
        relationships: {
          habitId,
          templateId,
          date
        }
      };

      // Create the task
      createTask(task);
      
      // Add the Habit tag
      addTagToEntity('Habit', taskId, 'task');
      
      // Add template tag if available (e.g., "Mindfulness")
      if (templateId) {
        // Format template name correctly with first letter capitalized
        // Handles both camelCase and kebab-case formats
        let templateName = '';
        
        if (templateId.includes('-')) {
          // Handle kebab-case: "morning-routine" -> "Morning Routine"
          templateName = templateId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        } else {
          // Handle camelCase: "morningRoutine" -> "Morning Routine"
          templateName = templateId
            // Insert a space before all capital letters
            .replace(/([A-Z])/g, ' $1')
            // Capitalize the first letter
            .replace(/^./, str => str.toUpperCase())
            .trim();
        }
        
        console.log(`Adding template tag "${templateName}" to task ${taskId}`);
        addTagToEntity(templateName, taskId, 'task');
      }

      // Create relationship
      eventBus.emit('relationship:create', {
        sourceId: habitId,
        sourceType: 'habit',
        targetId: taskId,
        targetType: 'task',
        relationType: 'habit-task'
      });
      
      // Force a UI update
      setTimeout(() => {
        forceTaskUpdate();
      }, 50);
    } finally {
      // Release the lock after a short delay to prevent race conditions
      setTimeout(() => {
        processingEventRef.current = false;
      }, 50);
    }
  }, [tasks, addTagToEntity, createTask, forceTaskUpdate]);

  // Setup event listener for habit scheduling
  useEffect(() => {
    const unsubscribeSchedule = eventBus.on('habit:schedule', handleHabitSchedule);
    
    // Clean up tracking map daily
    const setupDailyCleanup = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        console.log('Clearing scheduled tasks tracking map');
        scheduledTasksRef.current.clear();
        setupDailyCleanup(); // Set up next day's cleanup
      }, timeUntilMidnight);
    };
    
    setupDailyCleanup();
    
    return () => {
      unsubscribeSchedule();
    };
  }, [handleHabitSchedule]);

  // Expose methods for handling tasks
  const handleTaskDelete = useCallback(({ taskId }: { taskId: string, reason?: string }) => {
    // Find the task
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.relationships?.habitId || !task.relationships?.date) return;
    
    // Remove from tracking map
    const taskKey = `${task.relationships.habitId}-${task.relationships.date}`;
    if (scheduledTasksRef.current.has(taskKey)) {
      console.log(`Removing tracked task key ${taskKey} for task ${taskId}`);
      scheduledTasksRef.current.delete(taskKey);
    }
  }, [tasks]);

  // Setup task deletion listener
  useEffect(() => {
    const unsubscribeTaskDelete = eventBus.on('task:delete', handleTaskDelete);
    
    return () => {
      unsubscribeTaskDelete();
    };
  }, [handleTaskDelete]);

  return { scheduledTasksRef };
};
