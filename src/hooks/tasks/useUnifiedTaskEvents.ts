
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Unified hook for task events and actions
 * 
 * This hook consolidates functionality from previously separate hooks:
 * - useTaskEvents
 * - useTaskActions
 * - useTaskManager
 */
export const useUnifiedTaskEvents = () => {
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
  
  // Show image in modal
  const showTaskImage = useCallback((imageUrl: string, taskName: string) => {
    eventManager.emit('task:show-image', {
      imageUrl,
      taskName
    });
  }, []);
  
  // Open checklist modal
  const openTaskChecklist = useCallback((taskId: string, taskName: string, items: any[]) => {
    eventManager.emit('task:open-checklist', {
      taskId,
      taskName,
      items
    });
  }, []);
  
  // Open journal modal
  const openTaskJournal = useCallback((taskId: string, taskName: string, entry: string = '') => {
    eventManager.emit('task:open-journal', {
      taskId,
      taskName,
      entry
    });
  }, []);
  
  // Open voice recorder modal
  const openTaskVoiceRecorder = useCallback((taskId: string, taskName: string) => {
    eventManager.emit('task:open-voice-recorder', {
      taskId,
      taskName
    });
  }, []);
  
  // Check pending habits
  const checkPendingHabits = useCallback(() => {
    console.log('Checking pending habits');
    eventManager.emit('habits:check-pending', {});
  }, []);

  return {
    // Creation and modification
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    dismissTask,
    trackTaskTime,
    forceTaskUpdate,
    
    // Modal actions
    showTaskImage,
    openTaskChecklist,
    openTaskJournal,
    openTaskVoiceRecorder,
    
    // Habit integration
    checkPendingHabits
  };
};
