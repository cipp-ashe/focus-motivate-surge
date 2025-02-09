
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

const MAX_COMPLETED_TASKS = 100;
const STORAGE_CLEANUP_INTERVAL = 1000 * 60 * 60; // Clean up hourly instead of daily
const STORAGE_QUOTA_THRESHOLD = 0.9; // 90% of quota

const estimateStorageSize = (data: any): number => {
  try {
    const str = JSON.stringify(data);
    return str.length * 2; // Approximate bytes
  } catch (error) {
    console.error('Error estimating storage size:', error);
    return 0;
  }
};

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
    // Check storage quota
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ usage = 0, quota = 0 }) => {
        const usageRatio = usage / quota;
        if (usageRatio > STORAGE_QUOTA_THRESHOLD) {
          toast.warning("Local storage is nearly full. Cleaning up old data...", {
            duration: 5000,
          });
          
          // Aggressive cleanup when near quota
          const completedTasks = loadFromStorage('completedTasks', []);
          if (completedTasks.length > MAX_COMPLETED_TASKS / 2) {
            const trimmed = completedTasks.slice(-MAX_COMPLETED_TASKS / 2);
            localStorage.setItem('completedTasks', JSON.stringify(trimmed));
          }
        }
      });
    }

    // Regular cleanup
    const completedTasks = loadFromStorage('completedTasks', []);
    if (completedTasks.length > MAX_COMPLETED_TASKS) {
      const trimmed = completedTasks.slice(-MAX_COMPLETED_TASKS);
      localStorage.setItem('completedTasks', JSON.stringify(trimmed));
    }

    // Remove old tasks
    const tasks = loadFromStorage('taskList', []);
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15); // Reduced from 30 to 15 days
    
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate > fifteenDaysAgo;
    });

    if (filteredTasks.length < tasks.length) {
      localStorage.setItem('taskList', JSON.stringify(filteredTasks));
      console.log(`Cleaned up ${tasks.length - filteredTasks.length} old tasks`);
    }

  } catch (error) {
    console.error('Error during storage cleanup:', error);
    toast.error("Failed to clean up storage");
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

  // Run storage cleanup more frequently
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
    // Check size before updating
    const newSize = estimateStorageSize(value);
    if (newSize > 5 * 1024 * 1024) { // 5MB threshold
      toast.warning("Data size is getting large. Consider clearing old items.", {
        duration: 5000,
      });
    }

    setData(prev => ({ ...prev, [key]: value }));
    try {
      localStorage.setItem(
        storageKey || key, 
        key === 'lastSyncDate' 
          ? (value as Date).toISOString()
          : JSON.stringify(value)
      );
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        toast.error("Storage limit reached. Cleaning up old data...");
        cleanupStorage();
        // Retry storage update after cleanup
        try {
          localStorage.setItem(
            storageKey || key,
            key === 'lastSyncDate' 
              ? (value as Date).toISOString()
              : JSON.stringify(value)
          );
        } catch (retryError) {
          toast.error("Unable to save data. Please clear some space manually.");
        }
      } else {
        console.error('Error updating storage:', error);
        toast.error("Failed to save data");
      }
    }
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
