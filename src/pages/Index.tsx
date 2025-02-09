
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
import { initializeDataStore, SCHEMA_VERSION } from "@/types/core";
import { toast } from "sonner";

const Index = () => {
  console.log('Mounting Index component');

  // Initialize data store on component mount
  useEffect(() => {
    const initialized = initializeDataStore();
    if (!initialized) {
      toast.error('Failed to initialize data store');
    } else {
      console.log('Data store initialized with schema version:', SCHEMA_VERSION);
    }
  }, []);

  const { toggle: toggleNotes, close: closeNotes } = useNotesPanel();
  const { toggle: toggleHabits, close: closeHabits } = useHabitsPanel();

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

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

  // Load and monitor relationships
  useEffect(() => {
    try {
      const relations = localStorage.getItem('entity-relations');
      console.log('Loading entity relations:', relations);
      
      const handleRelationsUpdate = () => {
        console.log('Entity relations updated');
        // Handle updates to relationships here
      };

      window.addEventListener('relationsUpdated', handleRelationsUpdate);
      return () => {
        window.removeEventListener('relationsUpdated', handleRelationsUpdate);
      };
    } catch (error) {
      console.error('Error loading entity relations:', error);
      toast.error('Error loading entity relations');
    }
  }, []);

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
        toast.error('Error updating templates');
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

  console.log('Index rendering with:', {
    tasks: tasks.length,
    completedTasks: initialCompletedTasks.length,
    activeTemplates: activeTemplates.length
  });

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

