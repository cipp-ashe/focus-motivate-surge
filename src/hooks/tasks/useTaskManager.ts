
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { activeTasksStorage } from '@/lib/storage/task/activeTasksStorage';
import { v4 as uuidv4 } from 'uuid';

export const useTaskManager = () => {
  const createTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    
    // Add to storage
    activeTasksStorage.addTask(newTask);
    
    // Emit event
    eventBus.emit('task:create', newTask);
    
    return newTask;
  }, []);
  
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    // Load task
    const tasks = activeTasksStorage.loadTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.error(`Task with ID ${taskId} not found`);
      return null;
    }
    
    // Update task
    const updatedTask = { ...task, ...updates };
    
    // Save to storage
    activeTasksStorage.updateTask(taskId, updatedTask);
    
    // Emit event
    eventBus.emit('task:update', { taskId, updates });
    
    return updatedTask;
  }, []);
  
  const deleteTask = useCallback((taskId: string, reason?: string, suppressToast?: boolean) => {
    // Remove from storage
    activeTasksStorage.removeTask(taskId);
    
    // Emit event
    eventBus.emit('task:delete', { taskId, reason, suppressToast });
  }, []);
  
  return { createTask, updateTask, deleteTask };
};
