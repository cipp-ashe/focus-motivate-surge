
import { useState, useEffect, useCallback } from 'react';
import { Task, TaskMetrics } from '@/types/tasks';
import { toast } from 'sonner';

const TASKS_STORAGE_KEY = 'taskList';
const COMPLETED_TASKS_STORAGE_KEY = 'completedTasks';

// Custom event names
export const TASKS_UPDATED_EVENT = 'tasksUpdated';
export const COMPLETED_TASKS_UPDATED_EVENT = 'completedTasksUpdated';
export const TASK_OPERATION_EVENT = 'taskOperation';

interface TaskOperationEvent {
  type: 'add' | 'update' | 'delete' | 'complete' | 'clear';
  taskId?: string;
  task?: Task;
  metrics?: TaskMetrics;
}

const parseStoredTasks = (stored: string | null): Task[] => {
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing stored tasks:', error);
    return [];
  }
};

export const useTaskStorage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Load initial data and subscribe to events
  useEffect(() => {
    const loadTasks = () => {
      console.log('Loading tasks from storage');
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const savedCompletedTasks = localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
      
      setTasks(parseStoredTasks(savedTasks));
      setCompletedTasks(parseStoredTasks(savedCompletedTasks));
    };

    const handleTaskOperation = (event: CustomEvent<TaskOperationEvent>) => {
      console.log('Task operation:', event.detail);
      loadTasks(); // Reload tasks after any operation
    };

    loadTasks();

    // Subscribe to storage and custom events
    window.addEventListener('storage', loadTasks);
    window.addEventListener(TASKS_UPDATED_EVENT, loadTasks);
    window.addEventListener(COMPLETED_TASKS_UPDATED_EVENT, loadTasks);
    window.addEventListener(TASK_OPERATION_EVENT, handleTaskOperation as EventListener);

    return () => {
      window.removeEventListener('storage', loadTasks);
      window.removeEventListener(TASKS_UPDATED_EVENT, loadTasks);
      window.removeEventListener(COMPLETED_TASKS_UPDATED_EVENT, loadTasks);
      window.removeEventListener(TASK_OPERATION_EVENT, handleTaskOperation as EventListener);
    };
  }, []);

  const dispatchTaskOperation = useCallback((operation: TaskOperationEvent) => {
    const event = new CustomEvent(TASK_OPERATION_EVENT, { detail: operation });
    window.dispatchEvent(event);
  }, []);

  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
    window.dispatchEvent(new Event(TASKS_UPDATED_EVENT));
  }, []);

  const updateCompletedTasks = useCallback((newCompletedTasks: Task[]) => {
    setCompletedTasks(newCompletedTasks);
    localStorage.setItem(COMPLETED_TASKS_STORAGE_KEY, JSON.stringify(newCompletedTasks));
    window.dispatchEvent(new Event(COMPLETED_TASKS_UPDATED_EVENT));
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    updateTasks([...tasks, newTask]);
    dispatchTaskOperation({ type: 'add', task: newTask });
    toast.success('Task added 📝');
  }, [tasks, updateTasks, dispatchTaskOperation]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    updateTasks(newTasks);
    dispatchTaskOperation({ type: 'update', taskId, task: newTasks.find(t => t.id === taskId) });
  }, [tasks, updateTasks, dispatchTaskOperation]);

  const deleteTask = useCallback((taskId: string) => {
    // Check both active and completed tasks
    updateTasks(tasks.filter(task => task.id !== taskId));
    updateCompletedTasks(completedTasks.filter(task => task.id !== taskId));
    
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    
    dispatchTaskOperation({ type: 'delete', taskId });
  }, [tasks, completedTasks, selectedTaskId, updateTasks, updateCompletedTasks, dispatchTaskOperation]);

  const completeTask = useCallback((taskId: string, metrics?: TaskMetrics) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const completedTask: Task = {
      ...task,
      completed: true,
      metrics,
    };

    updateCompletedTasks([...completedTasks, completedTask]);
    updateTasks(tasks.filter(t => t.id !== taskId));

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    
    dispatchTaskOperation({ type: 'complete', taskId, task: completedTask, metrics });
    toast.success('Task completed 🎯');
  }, [tasks, completedTasks, selectedTaskId, updateTasks, updateCompletedTasks, dispatchTaskOperation]);

  const clearTasks = useCallback(() => {
    updateTasks([]);
    setSelectedTaskId(null);
    dispatchTaskOperation({ type: 'clear' });
    toast.success('Tasks cleared 🗑️');
  }, [updateTasks, dispatchTaskOperation]);

  const clearCompletedTasks = useCallback(() => {
    updateCompletedTasks([]);
    dispatchTaskOperation({ type: 'clear' });
    toast.success('Completed tasks cleared 🗑️');
  }, [updateCompletedTasks, dispatchTaskOperation]);

  return {
    tasks,
    completedTasks,
    selectedTaskId,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask: setSelectedTaskId,
    clearTasks,
    clearCompletedTasks,
  };
};
