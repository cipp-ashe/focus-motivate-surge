
import { useState, useEffect } from "react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { Header } from "@/components/layout/Header";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { TodaysHabits } from "@/components/habits/TodaysHabits";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";
import type { ActiveTemplate, HabitDetail } from "@/components/habits/types";
import { toast } from "sonner";

const Index = () => {
  const { toggle: toggleNotes, close: closeNotes } = useNotesPanel();
  const { toggle: toggleHabits, close: closeHabits } = useHabitsPanel();

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
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('habit-templates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading active templates:', error);
      return [];
    }
  });

  const { todaysHabits } = useTodaysHabits(activeTemplates);

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
    localStorage.setItem('taskList', JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const handleCompletedTasksUpdate = (tasks: Task[]) => {
    localStorage.setItem('completedTasks', JSON.stringify(tasks));
  };

  const handleFavoritesUpdate = (newFavorites: Quote[]) => {
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const handleHabitClick = (habit: HabitDetail) => {
    setCompletedHabits(prev => {
      const newCompleted = prev.includes(habit.id) 
        ? prev.filter(id => id !== habit.id)
        : [...prev, habit.id];
      return newCompleted;
    });
  };

  const handleAddHabitToTasks = (habit: HabitDetail) => {
    const newTask: Task = {
      id: `habit-task-${habit.id}-${Date.now()}`,
      name: habit.name,
      duration: habit.duration,
      completed: false,
    };
    
    const taskExists = tasks.some(task => 
      task.name === habit.name && !task.completed
    );

    if (taskExists) {
      toast.error("This habit is already in your task list");
      return;
    }

    handleTasksUpdate([...tasks, newTask]);
    toast.success("Habit added to tasks");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-7">
        <Header 
          onNotesClick={handleNotesClick}
          onHabitsClick={handleHabitsClick}
        />

        <TodaysHabits
          habits={todaysHabits}
          completedHabits={completedHabits}
          onHabitClick={handleHabitClick}
          onAddHabitToTasks={handleAddHabitToTasks}
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
      </div>
    </div>
  );
};

export default Index;

