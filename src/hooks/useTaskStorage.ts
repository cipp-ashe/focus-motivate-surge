
import { useState, useEffect, useCallback } from 'react';
import { Task, TaskMetrics } from '@/types/tasks';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';

const TASKS_STORAGE_KEY = 'taskList';
const COMPLETED_TASKS_STORAGE_KEY = 'completedTasks';

const parseStoredTasks = (stored: string | null): Task[] => {
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing stored tasks:', error);
    return [];
  }
};

export const useTaskStorage = () => {
  const [items, setItems] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const savedCompletedTasks = localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
      
      setItems(parseStoredTasks(savedTasks));
      setCompleted(parseStoredTasks(savedCompletedTasks));
    };

    loadTasks();

    const handleTaskCreate = (task: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setItems(prev => [...prev, newTask]);
      toast.success('Task added 📝');
    };

    const handleTaskUpdate = ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      setItems(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));
    };

    const handleTaskDelete = (taskId: string) => {
      setItems(prev => prev.filter(task => task.id !== taskId));
      setCompleted(prev => prev.filter(task => task.id !== taskId));
      setSelected(prev => prev === taskId ? null : prev);
    };

    const handleTaskSelect = (taskId: string | null) => {
      setSelected(taskId);
    };

    const handleTaskComplete = ({ taskId, metrics }: { taskId: string; metrics?: TaskMetrics }) => {
      const task = items.find(t => t.id === taskId);
      if (!task) return;

      const completedTask: Task = {
        ...task,
        completed: true,
        metrics,
      };

      setCompleted(prev => [...prev, completedTask]);
      setItems(prev => prev.filter(t => t.id !== taskId));
      setSelected(prev => prev === taskId ? null : prev);
      toast.success('Task completed 🎯');
    };

    // Subscribe to events
    eventBus.on('task:create', handleTaskCreate);
    eventBus.on('task:update', handleTaskUpdate);
    eventBus.on('task:delete', handleTaskDelete);
    eventBus.on('task:select', handleTaskSelect);
    eventBus.on('task:complete', handleTaskComplete);

    // Cleanup subscriptions
    return () => {
      eventBus.off('task:create', handleTaskCreate);
      eventBus.off('task:update', handleTaskUpdate);
      eventBus.off('task:delete', handleTaskDelete);
      eventBus.off('task:select', handleTaskSelect);
      eventBus.off('task:complete', handleTaskComplete);
    };
  }, [items]);

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_TASKS_STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  return {
    items,
    completed,
    selected
  };
};
