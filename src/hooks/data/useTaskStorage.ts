
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';

const STORAGE_KEY = 'taskList';

export const useTaskStorage = () => {
  const saveTasks = useCallback((tasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      window.dispatchEvent(new Event('tasksUpdated'));
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast.error('Failed to save tasks. Please try again.');
    }
  }, []);

  const loadTasks = useCallback((): Task[] => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks. Please try again.');
      return [];
    }
  }, []);

  return { saveTasks, loadTasks };
};
