
import { useState, useEffect } from "react";
import type { Task } from "@/types/tasks";
import type { Quote } from "@/types/timer";
import type { ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";

interface StorageData {
  lastSyncDate: Date;
  tasks: Task[];
  completedTasks: Task[];
  favorites: Quote[];
  activeTemplates: ActiveTemplate[];
}

const MAX_COMPLETED_TASKS = 100; // Keep only last 100 completed tasks
const STORAGE_CLEANUP_INTERVAL = 1000 * 60 * 60 * 24; // Clean up daily

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    return key === 'lastSyncDate' 
      ? new Date(saved) as unknown as T
      : JSON.parse(saved);
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    toast.error(`Error loading ${key}`);
    return defaultValue;
  }
};

const cleanupStorage = () => {
  try {
    // Trim completed tasks
    const completedTasks = loadFromStorage('completedTasks', []);
    if (completedTasks.length > MAX_COMPLETED_TASKS) {
      const trimmed = completedTasks.slice(-MAX_COMPLETED_TASKS);
      localStorage.setItem('completedTasks', JSON.stringify(trimmed));
    }

    // Remove very old tasks (older than 30 days)
    const tasks = loadFromStorage('taskList', []);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate > thirtyDaysAgo;
    });

    if (filteredTasks.length < tasks.length) {
      localStorage.setItem('taskList', JSON.stringify(filteredTasks));
    }

    // Clear any orphaned data
    const lastCleanup = localStorage.getItem('lastStorageCleanup');
    if (!lastCleanup || new Date(lastCleanup) < thirtyDaysAgo) {
      localStorage.setItem('lastStorageCleanup', new Date().toISOString());
    }
  } catch (error) {
    console.error('Error during storage cleanup:', error);
  }
};

export const useLocalStorageData = () => {
  const [data, setData] = useState<StorageData>({
    lastSyncDate: loadFromStorage('lastSyncDate', new Date()),
    tasks: loadFromStorage('taskList', []),
    completedTasks: loadFromStorage('completedTasks', []),
    favorites: loadFromStorage('favoriteQuotes', []),
    activeTemplates: loadFromStorage('habit-templates', [])
  });

  // Run storage cleanup periodically
  useEffect(() => {
    cleanupStorage(); // Initial cleanup
    const interval = setInterval(cleanupStorage, STORAGE_CLEANUP_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const updateStorage = <K extends keyof StorageData>(
    key: K, 
    value: StorageData[K], 
    storageKey?: string
  ) => {
    setData(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(
      storageKey || key, 
      key === 'lastSyncDate' 
        ? (value as Date).toISOString()
        : JSON.stringify(value)
    );
  };

  return {
    ...data,
    setActiveTemplates: (templates: ActiveTemplate[]) => 
      updateStorage('activeTemplates', templates, 'habit-templates'),
    handleTasksUpdate: (newTasks: Task[]) => 
      updateStorage('tasks', newTasks, 'taskList'),
    handleLastSyncUpdate: (date: Date) => 
      updateStorage('lastSyncDate', date),
    handleCompletedTasksUpdate: (tasks: Task[]) => 
      updateStorage('completedTasks', tasks),
    handleFavoritesUpdate: (newFavorites: Quote[]) => 
      updateStorage('favorites', newFavorites, 'favoriteQuotes')
  };
};
