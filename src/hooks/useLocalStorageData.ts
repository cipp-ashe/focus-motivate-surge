
import { useState } from "react";
import type { Task } from "@/components/tasks/TaskList";
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

export const useLocalStorageData = () => {
  const [data, setData] = useState<StorageData>({
    lastSyncDate: loadFromStorage('lastSyncDate', new Date()),
    tasks: loadFromStorage('taskList', []),
    completedTasks: loadFromStorage('completedTasks', []),
    favorites: loadFromStorage('favoriteQuotes', []),
    activeTemplates: loadFromStorage('habit-templates', [])
  });

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

