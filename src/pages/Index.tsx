
import { useState, useEffect } from "react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { Header } from "@/components/layout/Header";
import { TodaysHabitCard } from "@/components/habits/TodaysHabitCard";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";
import type { HabitDetail, ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";

const Index = () => {
  const { toggle: toggleNotes, close: closeNotes } = useNotesPanel();
  const { toggle: toggleHabits, close: closeHabits } = useHabitsPanel();

  // Load initial tasks from localStorage
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

  // Load active templates from localStorage and update when they change
  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('habit-templates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading active templates:', error);
      return [];
    }
  });

  // Listen for template updates
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

  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const handleNotesClick = () => {
    closeHabits();
    toggleNotes();
  };

  const handleHabitsClick = () => {
    closeNotes();
    toggleHabits();
  };

  const handleTasksUpdate = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('taskList', JSON.stringify(newTasks));
  };

  const handleCompletedTasksUpdate = (tasks: Task[]) => {
    localStorage.setItem('completedTasks', JSON.stringify(tasks));
  };

  const handleFavoritesUpdate = (newFavorites: Quote[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
  };

  const handleAddHabitToTasks = (habit: HabitDetail) => {
    if (!habit.duration) {
      console.warn('Habit has no duration:', habit);
      toast.error("This habit doesn't have a duration set");
      return;
    }

    const newTask: Task = {
      id: `habit-task-${habit.id}`,
      name: habit.name,
      completed: false,
      duration: habit.duration || 25,
      metrics: undefined
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
    setSelectedTaskId(newTask.id);
    toast.success(`Started "${habit.name}"`);
  };

  const handleHabitComplete = (habit: HabitDetail) => {
    setCompletedHabits(prev => {
      if (prev.includes(habit.id)) {
        return prev.filter(id => id !== habit.id);
      }
      return [...prev, habit.id];
    });
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-7">
        <Header 
          onNotesClick={handleNotesClick}
          onHabitsClick={handleHabitsClick}
        />

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

        <TodaysHabitCard
          habits={todaysHabits}
          completedHabits={completedHabits}
          onHabitComplete={handleHabitComplete}
          onAddHabitToTasks={handleAddHabitToTasks}
        />
      </div>
    </div>
  );
};

export default Index;

