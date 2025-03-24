
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';

/**
 * Unified hook for task management that combines functionality from
 * useTaskManager, useTaskActions, and useTaskEvents
 */
export const useTaskManagement = () => {
  /**
   * Create a new task
   */
  const createTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    
    console.log('Creating task:', newTask);
    
    // Emit event
    eventManager.emit('task:create', newTask);
    
    return newTask;
  }, []);
  
  /**
   * Update an existing task
   */
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log(`Updating task ${taskId}:`, updates);
    
    // Emit event
    eventManager.emit('task:update', { taskId, updates });
  }, []);
  
  /**
   * Delete a task
   */
  const deleteTask = useCallback((taskId: string, reason?: string) => {
    console.log(`Deleting task ${taskId}`, reason ? `Reason: ${reason}` : '');
    
    // Emit event with standardized payload
    eventManager.emit('task:delete', { taskId, reason });
  }, []);
  
  /**
   * Complete a task
   */
  const completeTask = useCallback((taskId: string, metrics?: any) => {
    console.log(`Completing task ${taskId}`, metrics ? `Metrics: ${JSON.stringify(metrics)}` : '');
    
    // Emit event
    eventManager.emit('task:complete', { taskId, metrics });
  }, []);
  
  /**
   * Select a task for editing
   */
  const selectTask = useCallback((taskId: string | null) => {
    console.log(`Selecting task: ${taskId}`);
    
    // Emit event
    eventManager.emit('task:select', taskId);
  }, []);
  
  /**
   * Dismiss a task (especially for habits)
   */
  const dismissTask = useCallback((taskId: string, habitId?: string, date?: string) => {
    console.log(`Dismissing task ${taskId} for habit ${habitId} on ${date}`);
    
    // Emit event
    eventManager.emit('task:dismiss', { 
      taskId, 
      habitId: habitId || '', 
      date: date || new Date().toISOString() 
    });
  }, []);
  
  /**
   * Force update of task list
   */
  const forceTaskUpdate = useCallback(() => {
    console.log('Forcing task update');
    
    // Force update via window event (legacy method)
    window.dispatchEvent(new Event('force-task-update'));
    
    // Also emit via event manager
    eventManager.emit('task:reload', undefined);
    eventManager.emit('task:force-update', undefined);
  }, []);
  
  return {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    dismissTask,
    forceTaskUpdate
  };
};
