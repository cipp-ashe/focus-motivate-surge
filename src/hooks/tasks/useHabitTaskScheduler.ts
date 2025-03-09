
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
  const pendingTasksRef = useRef<HabitTaskEvent[]>([]);

  // Process any pending tasks that failed to schedule earlier
  const processPendingTasks = useCallback(() => {
    if (pendingTasksRef.current.length === 0) return;
    
    console.log(`Processing ${pendingTasksRef.current.length} pending habit tasks`);
    
    // Clone and clear the pending tasks
    const tasksToProcess = [...pendingTasksRef.current];
    pendingTasksRef.current = [];
    
    // Process each task
    tasksToProcess.forEach(event => {
      eventBus.emit('habit:schedule', event);
    });
  }, []);

  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    // Prevent concurrent processing of events
    if (processingEventRef.current) {
      console.log('TaskScheduler: Already processing a habit:schedule event, queuing for later');
      pendingTasksRef.current.push(event);
      setTimeout(() => processPendingTasks(), 300);
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
      
      // Check in memory task list
      const existingTaskInMemory = tasks.find(task => 
        task.relationships?.habitId === habitId && 
        task.relationships?.date === date
      );
      
      if (existingTaskInMemory) {
        console.log(`Task already exists in memory for habit ${habitId} on ${date}:`, existingTaskInMemory);
        scheduledTasksRef.current.set(taskKey, existingTaskInMemory.id);
        processingEventRef.current = false;
        return;
      }
      
      // Also check localStorage directly
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const existingTaskInStorage = storedTasks.find((task: Task) => 
        task.relationships?.habitId === habitId && 
        task.relationships?.date === date
      );
      
      if (existingTaskInStorage) {
        console.log(`Task already exists in localStorage for habit ${habitId} on ${date}:`, existingTaskInStorage);
        scheduledTasksRef.current.set(taskKey, existingTaskInStorage.id);
        
        // Force a task update to ensure the task is loaded
        setTimeout(() => forceTaskUpdate(), 100);
        
        processingEventRef.current = false;
        return;
      }

      // Generate a task ID - use UUID for guaranteed uniqueness
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

      // Create the task via event bus
      eventBus.emit('task:create', task);
      
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
      
      // Store task directly in localStorage
      const currentTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      // Check if the task already exists
      if (!currentTasks.some((t: Task) => t.id === task.id)) {
        const updatedTasks = [...currentTasks, task];
        localStorage.setItem('taskList', JSON.stringify(updatedTasks));
        console.log('Directly added task to localStorage:', task);
      }
      
      // Force a UI update with a slight delay to ensure everything is processed
      setTimeout(() => {
        forceTaskUpdate();
        
        // Dispatch a synthetic event to ensure TaskContext updates
        window.dispatchEvent(new Event('force-task-update'));
        
        console.log('Forced task update after creating task from habit');
      }, 200);
    } finally {
      // Release the lock after a short delay to prevent race conditions
      setTimeout(() => {
        processingEventRef.current = false;
        
        // Process any tasks that came in while we were busy
        if (pendingTasksRef.current.length > 0) {
          processPendingTasks();
        }
      }, 100);
    }
  }, [tasks, addTagToEntity, createTask, forceTaskUpdate, processPendingTasks]);

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
    
    // Also check for pending habits when component mounts
    const timeout = setTimeout(() => {
      eventBus.emit('habits:check-pending', {});
      console.log('Checking for pending habits on task scheduler mount');
      
      // Also verify against localStorage to ensure all tasks are loaded
      setTimeout(() => {
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const habitTasks = storedTasks.filter((task: Task) => task.relationships?.habitId);
        
        if (habitTasks.length > 0) {
          console.log(`Found ${habitTasks.length} habit tasks in localStorage, verifying in memory state`);
          
          // Force update to ensure these are loaded
          forceTaskUpdate();
        }
      }, 300);
    }, 500);
    
    return () => {
      unsubscribeSchedule();
      clearTimeout(timeout);
    };
  }, [handleHabitSchedule, forceTaskUpdate]);

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

  // Add method to manually check for habit tasks that should be scheduled
  const checkForMissingHabitTasks = useCallback(() => {
    console.log("Manually checking for missing habit tasks");
    
    // Process any pending tasks
    processPendingTasks();
    
    // Trigger a habit check
    eventBus.emit('habits:check-pending', {});
    
    // Verify against localStorage tasks
    setTimeout(() => {
      // Get all tasks from localStorage
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      
      // Find habit tasks
      const habitTasks = storedTasks.filter((task: Task) => task.relationships?.habitId);
      
      if (habitTasks.length > 0) {
        console.log(`Found ${habitTasks.length} habit tasks in localStorage during check`);
        
        // Find tasks that exist in localStorage but not in memory
        const missingTasks = habitTasks.filter((storedTask: Task) => 
          !tasks.some(memTask => memTask.id === storedTask.id)
        );
        
        if (missingTasks.length > 0) {
          console.log(`Found ${missingTasks.length} tasks in localStorage that are missing from memory`);
          
          // Force a task update to load these
          forceTaskUpdate();
        } else {
          console.log('All habit tasks from localStorage are already loaded in memory');
        }
      }
    }, 200);
  }, [tasks, processPendingTasks, forceTaskUpdate]);

  return { 
    scheduledTasksRef,
    checkForMissingHabitTasks 
  };
};
