
import { useState, useCallback } from 'react';
import { Task, TaskMetrics } from '@/types/tasks';
import { toast } from 'sonner';

interface UseTaskManagerProps {
  initialTasks?: Task[];
  initialCompletedTasks?: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
  onCompletedTasksUpdate?: (tasks: Task[]) => void;
}

export const useTaskManager = ({
  initialTasks = [],
  initialCompletedTasks = [],
  onTasksUpdate,
  onCompletedTasksUpdate,
}: UseTaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialCompletedTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => {
      const updated = [...prev, newTask];
      onTasksUpdate?.(updated);
      return updated;
    });
    toast.success('Task added 📝');
  }, [onTasksUpdate]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      onTasksUpdate?.(updated);
      return updated;
    });
  }, [onTasksUpdate]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const updated = prev.filter(task => task.id !== taskId);
      onTasksUpdate?.(updated);
      return updated;
    });
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    toast.success('Task removed 🗑️');
  }, [selectedTaskId, onTasksUpdate]);

  const completeTask = useCallback((taskId: string, metrics?: TaskMetrics) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const completedTask: Task = {
      ...task,
      completed: true,
      metrics,
    };

    setCompletedTasks(prev => {
      const updated = [...prev, completedTask];
      onCompletedTasksUpdate?.(updated);
      return updated;
    });

    setTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      onTasksUpdate?.(updated);
      return updated;
    });

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    toast.success('Task completed 🎯');
  }, [tasks, selectedTaskId, onTasksUpdate, onCompletedTasksUpdate]);

  const clearTasks = useCallback(() => {
    setTasks([]);
    setSelectedTaskId(null);
    onTasksUpdate?.([]);
    toast.success('Tasks cleared 🗑️');
  }, [onTasksUpdate]);

  const clearCompletedTasks = useCallback(() => {
    setCompletedTasks([]);
    onCompletedTasksUpdate?.([]);
    toast.success('Completed tasks cleared 🗑️');
  }, [onCompletedTasksUpdate]);

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
