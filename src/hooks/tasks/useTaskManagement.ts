
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';
import { useTaskEvents } from './useTaskEvents';

/**
 * Unified hook for task management
 */
export const useTaskManagement = () => {
  const taskEvents = useTaskEvents();
  
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
    taskEvents.createTask(newTask);
    
    return newTask;
  }, [taskEvents]);
  
  return {
    ...taskEvents,
    createTask
  };
};
