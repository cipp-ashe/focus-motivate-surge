
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';
import { EventType, EventPayload } from '@/types/events';
import { useEventEmitter } from '@/hooks/useEvent';

/**
 * Unified hook for task events and actions
 * 
 * This hook is the single source of truth for all task-related events
 */
export const useTaskEvents = () => {
  const { emit } = useEventEmitter();
  
  // Event subscriptions with proper typing
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
  const createTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    
    console.log('Creating task:', newTask);
    emit('task:create', newTask);
    
    return newTask;
  }, [emit]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log(`Updating task ${taskId}:`, updates);
    emit('task:update', { taskId, updates });
  }, [emit]);

  const deleteTask = useCallback((taskId: string, reason?: string) => {
    console.log(`Deleting task ${taskId}`, reason ? `Reason: ${reason}` : '');
    emit('task:delete', { taskId, reason });
  }, [emit]);

  const completeTask = useCallback((taskId: string, metrics?: any) => {
    console.log(`Completing task ${taskId}`, metrics ? `Metrics: ${JSON.stringify(metrics)}` : '');
    emit('task:complete', { taskId, metrics });
  }, [emit]);

  const selectTask = useCallback((taskId: string | null) => {
    emit('task:select', taskId);
  }, [emit]);

  const dismissTask = useCallback((taskId: string, habitId?: string, date?: string) => {
    emit('task:dismiss', { 
      taskId, 
      habitId, 
      date: date || new Date().toISOString() 
    });
  }, [emit]);
  
  const trackTaskTime = useCallback((taskId: string, minutes: number, notes?: string) => {
    emit('task:timer', { 
      taskId, 
      minutes, 
      notes
    });
  }, [emit]);
  
  const forceTaskUpdate = useCallback(() => {
    console.log("Force updating task list");
    emit('task:reload', undefined);
  }, [emit]);
  
  // Media-related event emitters
  const showTaskImage = useCallback((imageUrl: string, taskName: string) => {
    emit('task:show-image', {
      imageUrl,
      taskName
    });
  }, [emit]);
  
  const openTaskChecklist = useCallback((taskId: string, taskName: string, items: any[]) => {
    emit('task:open-checklist', {
      taskId,
      taskName,
      items
    });
  }, [emit]);
  
  const openTaskJournal = useCallback((taskId: string, taskName: string, entry: string = '') => {
    emit('task:open-journal', {
      taskId,
      taskName,
      entry
    });
  }, [emit]);
  
  const openTaskVoiceRecorder = useCallback((taskId: string, taskName: string) => {
    emit('task:open-voice-recorder', {
      taskId,
      taskName
    });
  }, [emit]);

  // Generic event emitter
  const emitEvent = useCallback(<E extends EventType>(eventType: E, payload?: EventPayload<E>) => {
    emit(eventType, payload);
  }, [emit]);
  
  // Habit integration
  const checkPendingHabits = useCallback(() => {
    console.log('Checking pending habits');
    emit('habits:check-pending', {});
  }, [emit]);

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

// Rename to follow consistent naming convention
export const useTasks = useTaskEvents;
