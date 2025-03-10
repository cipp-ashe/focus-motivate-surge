
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';
import { v4 as uuidv4 } from 'uuid';

export const useTaskManager = () => {
  const createTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    
    // Add to storage
    taskStorage.addTask(newTask);
    
    // Emit event
    eventBus.emit('task:create', newTask);
    
    return newTask;
  }, []);
  
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    // Load task
    const tasks = taskStorage.loadTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.error(`Task with ID ${taskId} not found`);
      return null;
    }
    
    // Update task
    const updatedTask = { ...task, ...updates };
    
    // Save to storage
    taskStorage.updateTask(updatedTask);
    
    // Emit event
    eventBus.emit('task:update', { taskId, updates });
    
    return updatedTask;
  }, []);
  
  const deleteTask = useCallback((taskId: string, reason?: string) => {
    // Remove from storage
    taskStorage.deleteTask(taskId);
    
    // Emit event
    eventBus.emit('task:delete', { taskId, reason });
  }, []);
  
  return { createTask, updateTask, deleteTask };
};
