
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for task storage operations using the centralized taskStorage module
 * Maintains internal state for active and completed tasks
 */
export const useTaskStorage = () => {
  const [items, setItems] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [cleared, setCleared] = useState<Task[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  // Initial loading of tasks from storage
  useEffect(() => {
    try {
      const loadedTasks = taskStorage.loadTasks();
      const loadedCompletedTasks = taskStorage.loadCompletedTasks();
      
      setItems(loadedTasks);
      setCompleted(loadedCompletedTasks);
      
      console.log("useTaskStorage: Initial load - active tasks:", loadedTasks.length, "completed tasks:", loadedCompletedTasks.length);
    } catch (error) {
      console.error('Error during initial task loading:', error);
      toast.error('Failed to load tasks. Please try again.');
    }
  }, []);

  // Update our state when the 'tasksUpdated' event is fired
  useEffect(() => {
    const handleTasksUpdated = () => {
      try {
        const loadedTasks = taskStorage.loadTasks();
        const loadedCompletedTasks = taskStorage.loadCompletedTasks();
        
        setItems(loadedTasks);
        setCompleted(loadedCompletedTasks);
        
        console.log("useTaskStorage: Tasks updated - active tasks:", loadedTasks.length, "completed tasks:", loadedCompletedTasks.length);
      } catch (error) {
        console.error('Error loading updated tasks:', error);
      }
    };

    window.addEventListener('tasksUpdated', handleTasksUpdated);
    return () => {
      window.removeEventListener('tasksUpdated', handleTasksUpdated);
    };
  }, []);

  const saveTasks = useCallback((tasks: Task[]) => {
    try {
      // Debug: Log tasks being saved
      console.log("useTaskStorage: Saving tasks:", tasks);
      
      // Use the taskStorage module to save tasks
      const result = taskStorage.saveTasks(tasks);
      
      if (result) {
        setItems(tasks);
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
      setItems(tasks);
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
        // Update our local state
        setItems(prev => [...prev, task]);
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
      setCompleted(tasks);
      return tasks;
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      toast.error('Failed to load completed tasks. Please try again.');
      return [];
    }
  }, []);

  /**
   * Select a task
   */
  const selectTask = useCallback((taskId: string | null) => {
    setSelected(taskId);
  }, []);

  return { 
    // State properties
    items, 
    completed,
    cleared,
    selected,
    
    // Methods
    saveTasks, 
    loadTasks,
    addTask,
    loadCompletedTasks,
    selectTask
  };
};
