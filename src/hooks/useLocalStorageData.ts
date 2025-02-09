
import { useState, useEffect } from "react";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";
import type { ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";

export const useLocalStorageData = () => {
  const [lastSyncDate, setLastSyncDate] = useState(() => {
    try {
      const saved = localStorage.getItem('lastSyncDate');
      console.log('Loading lastSyncDate:', saved);
      return saved ? new Date(saved) : new Date();
    } catch (error) {
      console.error('Error loading lastSyncDate:', error);
      toast.error('Error loading lastSyncDate');
      return new Date();
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('taskList');
      console.log('Loading tasks:', saved);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error loading tasks');
      return [];
    }
  });

  const [initialCompletedTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('completedTasks');
      console.log('Loading completed tasks:', saved);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      toast.error('Error loading completed tasks');
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteQuotes');
      console.log('Loading favorite quotes:', saved);
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorite quotes:', error);
      toast.error('Error loading favorite quotes');
      return [];
    }
  });

  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('habit-templates');
      console.log('Loading habit templates:', saved);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading habit templates:', error);
      toast.error('Error loading habit templates');
      return [];
    }
  });

  const handleTasksUpdate = (newTasks: Task[]) => {
    const currentTasksStr = JSON.stringify(tasks);
    const newTasksStr = JSON.stringify(newTasks);
    
    if (currentTasksStr !== newTasksStr) {
      localStorage.setItem('taskList', newTasksStr);
      setTasks(newTasks);
    }
  };

  const handleLastSyncUpdate = (date: Date) => {
    localStorage.setItem('lastSyncDate', date.toISOString());
    setLastSyncDate(date);
  };

  const handleCompletedTasksUpdate = (tasks: Task[]) => {
    localStorage.setItem('completedTasks', JSON.stringify(tasks));
  };

  const handleFavoritesUpdate = (newFavorites: Quote[]) => {
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  return {
    lastSyncDate,
    tasks,
    initialCompletedTasks,
    favorites,
    activeTemplates,
    setActiveTemplates,
    handleTasksUpdate,
    handleLastSyncUpdate,
    handleCompletedTasksUpdate,
    handleFavoritesUpdate
  };
};
