
import { useState, useEffect } from "react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { Header } from "@/components/layout/Header";
import { HabitTaskManager } from "@/components/habits/HabitTaskManager";
import { DailySyncManager } from "@/components/tasks/DailySyncManager";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";
import type { ActiveTemplate } from "@/components/habits/types";

const Index = () => {
  const { toggle: toggleNotes, close: closeNotes } = useNotesPanel();
  const { toggle: toggleHabits, close: closeHabits } = useHabitsPanel();

  const [lastSyncDate, setLastSyncDate] = useState(() => {
    const saved = localStorage.getItem('lastSyncDate');
    return saved ? new Date(saved) : new Date();
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('taskList');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });

  const [initialCompletedTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('completedTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteQuotes');
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorite quotes:', error);
      return [];
    }
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Load active templates with their tags
  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('habit-templates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading active templates:', error);
      return [];
    }
  });

  useEffect(() => {
    const handleTemplateUpdate = () => {
      try {
        const saved = localStorage.getItem('habit-templates');
        if (saved) {
          const templates = JSON.parse(saved);
          setActiveTemplates(templates);
        }
      } catch (error) {
        console.error('Error updating templates:', error);
      }
    };

    window.addEventListener('templatesUpdated', handleTemplateUpdate);
    return () => {
      window.removeEventListener('templatesUpdated', handleTemplateUpdate);
    };
  }, []);

  const handleNotesClick = () => {
    closeHabits();
    toggleNotes();
  };

  const handleHabitsClick = () => {
    closeNotes();
    toggleHabits();
  };

  const handleTasksUpdate = (newTasks: Task[]) => {
    const currentTasksStr = JSON.stringify(tasks);
    const newTasksStr = JSON.stringify(newTasks);
    
    // Only update if the tasks have actually changed
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

  return (
    <div className="min-h-screen h-full flex flex-col bg-background transition-colors duration-300">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-7 w-full overflow-hidden flex flex-col">
        <Header 
          onNotesClick={handleNotesClick}
          onHabitsClick={handleHabitsClick}
        />

        <HabitTaskManager
          tasks={tasks}
          onTasksUpdate={handleTasksUpdate}
          activeTemplates={activeTemplates}
        />

        <DailySyncManager
          lastSyncDate={lastSyncDate}
          tasks={tasks}
          onTasksUpdate={handleTasksUpdate}
          onLastSyncUpdate={handleLastSyncUpdate}
        />

        <div className="flex-1 overflow-hidden">
          <TaskManager
            initialTasks={tasks}
            initialCompletedTasks={initialCompletedTasks}
            initialFavorites={favorites}
            onTasksUpdate={handleTasksUpdate}
            onCompletedTasksUpdate={handleCompletedTasksUpdate}
            onFavoritesChange={handleFavoritesUpdate}
            selectedTaskId={selectedTaskId}
            onTaskSelect={setSelectedTaskId}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
