
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';
import { EventType, EventPayload } from '@/types/events';

/**
 * Unified hook for task events and actions
 * 
 * This hook consolidates all task-related events functionality
 * from previous hooks into a single source of truth
 */
export const useTaskEvents = () => {
  // Event subscriptions
  const onTaskCreate = useCallback((callback: (task: Task) => void) => {
    return eventManager.on('task:create', callback);
  }, []);

  const onTaskUpdate = useCallback((callback: (data: { taskId: string, updates: Partial<Task> }) => void) => {
    return eventManager.on('task:update', callback);
  }, []);

  const onTaskDelete = useCallback((callback: (data: { taskId: string, reason?: string }) => void) => {
    return eventManager.on('task:delete', callback);
  }, []);

  const onTaskComplete = useCallback((callback: (data: { taskId: string, metrics?: any }) => void) => {
    return eventManager.on('task:complete', callback);
  }, []);

  const onTaskSelect = useCallback((callback: (taskId: string | null) => void) => {
    return eventManager.on('task:select', callback);
  }, []);

  const onTaskReload = useCallback((callback: () => void) => {
    return eventManager.on('task:reload', callback);
  }, []);

  // Event emission
  // Create a new task with ID and timestamp
  const createTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    
    console.log('Creating task:', newTask);
    eventManager.emit('task:create', newTask);
    
    return newTask;
  }, []);

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

  // Generic event emitter
  const emitEvent = useCallback(<E extends EventType>(eventType: E, payload?: EventPayload<E>) => {
    eventManager.emit(eventType, payload);
  }, []);
  
  // Habit integration
  const checkPendingHabits = useCallback(() => {
    console.log('Checking pending habits');
    eventManager.emit('habits:check-pending', {});
  }, []);

  return {
    // Event subscriptions
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
    onTaskComplete,
    onTaskSelect,
    onTaskReload,
    
    // Event emitters
    emitEvent,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    dismissTask,
    trackTaskTime,
    forceTaskUpdate,
    checkPendingHabits,
    
    // Media actions
    showTaskImage,
    openTaskChecklist,
    openTaskJournal,
    openTaskVoiceRecorder,
  };
};

// For backward compatibility - these are just aliases
export const useTasks = useTaskEvents;
export const useUnifiedTaskEvents = useTaskEvents;
