
import { useState, useEffect } from "react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { Header } from "@/components/layout/Header";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { startOfDay, isToday } from "date-fns";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";
import type { ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";

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

  // Check if we need to reset tasks for a new day
  useEffect(() => {
    const today = startOfDay(new Date());
    const lastSync = startOfDay(new Date(lastSyncDate));

    if (!isToday(lastSync)) {
      // Clear non-habit tasks and reset habit tasks for the new day
      const habitTasks = tasks.filter(task => task.id.startsWith('habit-'));
      const resetHabitTasks = habitTasks.map(task => ({
        ...task,
        completed: false
      }));

      setTasks(resetHabitTasks);
      localStorage.setItem('taskList', JSON.stringify(resetHabitTasks));
      localStorage.setItem('lastSyncDate', today.toISOString());
      setLastSyncDate(today);
      
      toast.info("Tasks have been reset for the new day");
    }
  }, [lastSyncDate, tasks]);

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

  // Convert timer-type habits into tasks
  useEffect(() => {
    const timerHabits = todaysHabits.filter(habit => 
      habit.metrics.type === 'timer' && 
      habit.metrics.target && 
      habit.metrics.target > 0
    );
    
    console.log('Converting timer habits to tasks:', timerHabits);
    
    // Get non-habit tasks
    const nonHabitTasks = tasks.filter(task => !task.id.startsWith('habit-'));
    
    // Convert timer habits to tasks and ensure duration is set correctly
    const habitTasks: Task[] = timerHabits.map(habit => ({
      id: `habit-${habit.id}`,
      name: habit.name,
      completed: false,
      duration: habit.metrics.target, // Use target directly as duration
      createdAt: new Date().toISOString(),
      tags: [{ name: 'Habit', color: 'blue' }],
    }));

    const newTasks = [...nonHabitTasks, ...habitTasks];
    console.log('Updated tasks:', newTasks);
    
    if (JSON.stringify(newTasks) !== JSON.stringify(tasks)) {
      localStorage.setItem('taskList', JSON.stringify(newTasks));
      setTasks(newTasks);
    }
  }, [todaysHabits, tasks]);

  const handleNotesClick = () => {
    closeHabits();
    toggleNotes();
  };

  const handleHabitsClick = () => {
    closeNotes();
    toggleHabits();
  };

  const handleTasksUpdate = (newTasks: Task[]) => {
    if (JSON.stringify(newTasks) !== JSON.stringify(tasks)) {
      localStorage.setItem('taskList', JSON.stringify(newTasks));
      setTasks(newTasks);
    }
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

