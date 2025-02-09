
import { useState, useEffect, useCallback } from 'react';
import { Task, TaskMetrics } from '@/types/tasks';
import { toast } from 'sonner';

const TASKS_STORAGE_KEY = 'taskList';
const COMPLETED_TASKS_STORAGE_KEY = 'completedTasks';

// Custom event names
export const TASKS_UPDATED_EVENT = 'tasksUpdated';
export const COMPLETED_TASKS_UPDATED_EVENT = 'completedTasksUpdated';

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

  // Load initial data
  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const savedCompletedTasks = localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
      
      setTasks(parseStoredTasks(savedTasks));
      setCompletedTasks(parseStoredTasks(savedCompletedTasks));
    };

    loadTasks();

    // Subscribe to storage events
    window.addEventListener('storage', loadTasks);
    window.addEventListener(TASKS_UPDATED_EVENT, loadTasks);
    window.addEventListener(COMPLETED_TASKS_UPDATED_EVENT, loadTasks);

    return () => {
      window.removeEventListener('storage', loadTasks);
      window.removeEventListener(TASKS_UPDATED_EVENT, loadTasks);
      window.removeEventListener(COMPLETED_TASKS_UPDATED_EVENT, loadTasks);
    };
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
    toast.success('Task added 📝');
  }, [tasks, updateTasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    updateTasks(newTasks);
  }, [tasks, updateTasks]);

  const deleteTask = useCallback((taskId: string) => {
    updateTasks(tasks.filter(task => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    toast.success('Task removed 🗑️');
  }, [tasks, selectedTaskId, updateTasks]);

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
    toast.success('Task completed 🎯');
  }, [tasks, completedTasks, selectedTaskId, updateTasks, updateCompletedTasks]);

  const clearTasks = useCallback(() => {
    updateTasks([]);
    setSelectedTaskId(null);
    toast.success('Tasks cleared 🗑️');
  }, [updateTasks]);

  const clearCompletedTasks = useCallback(() => {
    updateCompletedTasks([]);
    toast.success('Completed tasks cleared 🗑️');
  }, [updateCompletedTasks]);

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
