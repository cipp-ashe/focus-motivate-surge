
import { useState } from "react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { Header } from "@/components/layout/Header";
import { TodaysHabits } from "@/components/habits/TodaysHabits";
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

  // Load active templates from localStorage
  const [activeTemplates] = useState<ActiveTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('habit-templates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading active templates:', error);
      return [];
    }
  });

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
    window.dispatchEvent(new CustomEvent('tasksUpdated', { detail: { tasks: newTasks } }));
  };

  const handleCompletedTasksUpdate = (tasks: Task[]) => {
    localStorage.setItem('completedTasks', JSON.stringify(tasks));
  };

  const handleFavoritesUpdate = (newFavorites: Quote[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
  };

  const handleAddHabitToTasks = (habit: HabitDetail) => {
    const newTask: Task = {
      id: `habit-task-${habit.id}`,
      name: habit.name,
      completed: false,
      duration: habit.duration || 25,
      metrics: undefined
    };
    handleTasksUpdate([newTask, ...tasks]);
    toast.success(`Added "${habit.name}" to tasks`);
  };

  const handleHabitClick = (habit: HabitDetail) => {
    if (completedHabits.includes(habit.id)) {
      setCompletedHabits(prev => prev.filter(id => id !== habit.id));
    } else {
      setCompletedHabits(prev => [...prev, habit.id]);
    }
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
        />

        <TodaysHabits
          habits={todaysHabits}
          completedHabits={completedHabits}
          onHabitClick={handleHabitClick}
          onAddHabitToTasks={handleAddHabitToTasks}
        />
      </div>
    </div>
  );
};

export default Index;
