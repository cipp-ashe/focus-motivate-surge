
import { useState, useEffect } from 'react';
import { Task, TaskMetrics } from '@/types/tasks';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { TimerStateMetrics } from '@/types/metrics';

const TASKS_STORAGE_KEY = 'taskList';
const COMPLETED_TASKS_STORAGE_KEY = 'completedTasks';
const CLEARED_TASKS_STORAGE_KEY = 'clearedTasks';

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
  const [cleared, setCleared] = useState<Task[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const savedCompletedTasks = localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
      const savedClearedTasks = localStorage.getItem(CLEARED_TASKS_STORAGE_KEY);
      
      setItems(parseStoredTasks(savedTasks));
      setCompleted(parseStoredTasks(savedCompletedTasks));
      setCleared(parseStoredTasks(savedClearedTasks));
    };

    loadTasks();

    // Event handlers
    const handleTaskCreate = (task: Task) => {
      setItems(prev => {
        if (prev.some(t => t.id === task.id)) {
          return prev;
        }
        toast.success('Task added 📝');
        return [...prev, task];
      });
    };

    const handleTaskUpdate = ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      setItems(prev => {
        const newItems = prev.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        );
        if (JSON.stringify(prev) !== JSON.stringify(newItems)) {
          toast.success('Task updated ✏️');
        }
        return newItems;
      });
    };

    const handleTaskDelete = ({ taskId, reason = 'manual' }: { taskId: string; reason?: Task['clearReason'] }) => {
      setItems(prev => {
        const taskToDelete = prev.find(t => t.id === taskId);
        if (!taskToDelete) return prev;

        if (reason === 'manual') {
          const clearedTask = { ...taskToDelete, clearReason: reason };
          setCleared(prevCleared => [...prevCleared, clearedTask]);
          toast.success('Task cleared 🗑️');
        }

        return prev.filter(task => task.id !== taskId);
      });
      
      setCompleted(prev => prev.filter(task => task.id !== taskId));
      setSelected(prev => prev === taskId ? null : prev);
    };

    const handleTaskSelect = (taskId: string | null) => {
      setSelected(taskId);
    };

    const handleTaskComplete = (payload: { taskId: string; metrics?: TaskMetrics | TimerStateMetrics }) => {
      const { taskId, metrics } = payload;
      const task = items.find(t => t.id === taskId);
      if (!task) return;

      // Ensure favoriteQuotes is properly formatted
      const safeMetrics = metrics ? {
        ...metrics,
        favoriteQuotes: Array.isArray(metrics.favoriteQuotes) 
          ? metrics.favoriteQuotes 
          : (metrics.favoriteQuotes ? [`${metrics.favoriteQuotes}`] : [])
      } : {};

      const completedTask: Task = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString(),
        metrics: safeMetrics as TaskMetrics,
        clearReason: 'completed'
      };

      setCompleted(prev => [...prev, completedTask]);
      setItems(prev => prev.filter(t => t.id !== taskId));
      setSelected(prev => prev === taskId ? null : prev);
      toast.success('Task completed 🎯');
    };

    // Subscribe to events and store unsubscribe functions
    const unsubCreate = eventManager.on('task:create', handleTaskCreate);
    const unsubUpdate = eventManager.on('task:update', handleTaskUpdate);
    const unsubDelete = eventManager.on('task:delete', handleTaskDelete);
    const unsubSelect = eventManager.on('task:select', handleTaskSelect);
    const unsubComplete = eventManager.on('task:complete', handleTaskComplete);

    // Cleanup subscriptions
    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      unsubSelect();
      unsubComplete();
    };
  }, []); 

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_TASKS_STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem(CLEARED_TASKS_STORAGE_KEY, JSON.stringify(cleared));
  }, [cleared]);

  return {
    items,
    completed,
    cleared,
    selected
  };
};
