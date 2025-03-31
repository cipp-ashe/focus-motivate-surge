
import { useCallback } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

/**
 * A unified hook for task management that consolidates functionality
 * from all task-related hooks into a single source of truth
 */
export const useUnifiedTaskManager = () => {
  // Create a new task with ID and timestamp
  const createTask = useCallback((task: Partial<Task>) => {
    // Ensure required fields
    if (!task.name) {
      console.error('Task must have a name');
      return null;
    }

    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      name: task.name,
      description: task.description || '',
      completed: task.completed || false,
      type: task.type || task.taskType || 'standard',
      duration: task.duration || 0,
      relationships: task.relationships || {},
      // Add all other properties from the task parameter
      ...task
    };
    
    console.log('Creating task:', newTask);
    eventManager.emit('task:create', newTask);
    
    return newTask;
  }, []);

  // Create a task from a completed task
  const createFromCompleted = useCallback((completedTask: Task) => {
    const { id, completedAt, completed, ...taskData } = completedTask;
    
    return createTask({
      ...taskData,
      name: `${taskData.name} (Repeat)`,
    });
  }, [createTask]);

  // Update an existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log(`Updating task ${taskId}:`, updates);
    eventManager.emit('task:update', { taskId, updates });
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId: string, reason?: string) => {
    console.log(`Deleting task ${taskId}`, reason ? `Reason: ${reason}` : '');
    eventManager.emit('task:delete', { taskId, reason });
  }, []);

  // Complete a task
  const completeTask = useCallback((taskId: string, metrics?: any) => {
    console.log(`Completing task ${taskId}`, metrics ? `Metrics: ${JSON.stringify(metrics)}` : '');
    eventManager.emit('task:complete', { taskId, metrics });
  }, []);

  // Select a task for editing
  const selectTask = useCallback((taskId: string | null) => {
    eventManager.emit('task:select', taskId);
  }, []);

  // Dismiss a task (especially for habits)
  const dismissTask = useCallback((taskId: string, habitId?: string, date?: string) => {
    eventManager.emit('task:dismiss', { 
      taskId, 
      habitId, 
      date: date || new Date().toISOString() 
    });
  }, []);
  
  // Track time spent on task
  const trackTaskTime = useCallback((taskId: string, minutes: number, notes?: string) => {
    eventManager.emit('task:timer', { 
      taskId, 
      minutes, 
      notes
    });
  }, []);
  
  // Force update task list
  const forceTaskUpdate = useCallback(() => {
    console.log("Force updating task list");
    eventManager.emit('task:reload', undefined);
  }, []);
  
  // Media-related event emitters
  const showTaskImage = useCallback((imageUrl: string, taskName: string) => {
    eventManager.emit('task:show-image', {
      imageUrl,
      taskName
    });
  }, []);
  
  const openTaskChecklist = useCallback((taskId: string, taskName: string, items: any[]) => {
    eventManager.emit('task:open-checklist', {
      taskId,
      taskName,
      items
    });
  }, []);
  
  const openTaskJournal = useCallback((taskId: string, taskName: string, entry: string = '') => {
    eventManager.emit('task:open-journal', {
      taskId,
      taskName,
      entry
    });
  }, []);
  
  const openTaskVoiceRecorder = useCallback((taskId: string, taskName: string) => {
    eventManager.emit('task:open-voice-recorder', {
      taskId,
      taskName
    });
  }, []);
  
  // Habit integration
  const checkPendingHabits = useCallback(() => {
    console.log('Checking pending habits');
    eventManager.emit('habits:check-pending', {});
  }, []);

  // Create a habit task
  const createHabitTask = useCallback((
    habitId: string,
    name: string,
    taskType: TaskType = 'habit',
    templateId: string = '',
    date: string = new Date().toISOString().split('T')[0],
    options?: {
      suppressToast?: boolean;
      duration?: number;
      selectAfterCreate?: boolean;
      metricType?: string;
    }
  ) => {
    console.log(`Creating task for habit ${habitId}`);
    
    const taskId = `habit-${habitId}-${date}`;
    
    const newTask: Task = {
      id: taskId,
      name,
      description: `Task for habit on ${date}`,
      type: taskType,
      completed: false,
      duration: options?.duration || 1800, // Default 30 minutes
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
      eventManager.emit('task:select', taskId);
    }
    
    if (!options?.suppressToast) {
      toast.success(`Created task for habit: ${name}`);
    }
    
    return taskId;
  }, []);

  return {
    // Creation and modification
    createTask,
    createFromCompleted,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    dismissTask,
    trackTaskTime,
    forceTaskUpdate,
    
    // Media actions
    showTaskImage,
    openTaskChecklist,
    openTaskJournal,
    openTaskVoiceRecorder,
    
    // Habit integration
    checkPendingHabits,
    createHabitTask
  };
};

// Provide a simpler alias for consistency in imports
export const useTaskManager = useUnifiedTaskManager;
