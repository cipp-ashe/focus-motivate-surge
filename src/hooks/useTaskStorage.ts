
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for task storage operations using the centralized taskStorage module
 */
export const useTaskStorage = () => {
  const saveTasks = useCallback((tasks: Task[]) => {
    try {
      // Debug: Log tasks being saved
      console.log("useTaskStorage: Saving tasks:", tasks);
      
      // Use the taskStorage module to save tasks
      const result = taskStorage.saveTasks(tasks);
      
      if (result) {
        window.dispatchEvent(new Event('tasksUpdated'));
      } else {
        console.error('Task storage operation failed');
        toast.error('Failed to save tasks. Please try again.');
      }
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast.error('Failed to save tasks. Please try again.');
    }
  }, []);

  const loadTasks = useCallback((): Task[] => {
    try {
      // Use the taskStorage module to load tasks
      const tasks = taskStorage.loadTasks();
      console.log("useTaskStorage: Loaded tasks:", tasks);
      return tasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks. Please try again.');
      return [];
    }
  }, []);

  /**
   * Add a single task to storage
   */
  const addTask = useCallback((task: Task): boolean => {
    try {
      // Use the taskStorage module to add a task
      const result = taskStorage.addTask(task);
      
      if (result) {
        window.dispatchEvent(new Event('tasksUpdated'));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.');
      return false;
    }
  }, []);

  /**
   * Load completed tasks from storage
   */
  const loadCompletedTasks = useCallback((): Task[] => {
    try {
      const tasks = taskStorage.loadCompletedTasks();
      console.log("useTaskStorage: Loaded completed tasks:", tasks);
      return tasks;
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      toast.error('Failed to load completed tasks. Please try again.');
      return [];
    }
  }, []);

  return { 
    saveTasks, 
    loadTasks,
    addTask,
    loadCompletedTasks
  };
};
