
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { TaskManager } from "@/components/tasks/TaskManager";
import { Moon, Sun, Code2, StickyNote, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Index = () => {
  const { isDark, toggleTheme } = useTheme(true);
  const { toggle: toggleNotes, close: closeNotes } = useNotesPanel();
  const { toggle: toggleHabits, close: closeHabits } = useHabitsPanel();

  // Load initial tasks from localStorage
  const [initialTasks] = useState<Task[]>(() => {
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
  const [activeTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('habit-templates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading active templates:', error);
      return [];
    }
  });

  const { todaysHabits, convertHabitToTask } = useTodaysHabits(activeTemplates);

  const handleNotesClick = () => {
    closeHabits();
    toggleNotes();
  };

  const handleHabitsClick = () => {
    closeNotes();
    toggleHabits();
  };

  // Handle task updates
  const handleTasksUpdate = (tasks: Task[]) => {
    localStorage.setItem('taskList', JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('tasksUpdated', { detail: { tasks } }));
  };

  const handleCompletedTasksUpdate = (tasks: Task[]) => {
    localStorage.setItem('completedTasks', JSON.stringify(tasks));
  };

  // Handle favorites updates
  const handleFavoritesUpdate = (newFavorites: Quote[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="flex justify-between items-center mb-4 sm:mb-7">
          <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Focus Timer
          </h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleHabitsClick}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Habits"
            >
              <ActivitySquare className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNotesClick}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Notes"
            >
              <StickyNote className="h-5 w-5" />
            </button>
            <Link 
              to="/components" 
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Developer Documentation"
            >
              <Code2 className="h-5 w-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/20"
            >
              {isDark ? (
                <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>

        {todaysHabits.length > 0 && (
          <Card className="mb-6 p-4 border-primary/20 bg-gradient-to-br from-card to-card/50">
            <h2 className="text-lg font-semibold mb-3 text-primary">Today's Habits</h2>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {todaysHabits.map((habit) => (
                  <div 
                    key={habit.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-primary/5 transition-colors border border-primary/10"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{habit.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{habit.description}</p>
                    </div>
                    {habit.duration && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const task = convertHabitToTask(habit);
                          handleTasksUpdate([task, ...initialTasks]);
                          toast.success(`Added "${habit.name}" to tasks`);
                        }}
                        className="ml-4 whitespace-nowrap hover:bg-primary hover:text-primary-foreground"
                      >
                        Add as Task
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}

        <TaskManager
          initialTasks={initialTasks}
          initialCompletedTasks={initialCompletedTasks}
          initialFavorites={favorites}
          onTasksUpdate={handleTasksUpdate}
          onCompletedTasksUpdate={handleCompletedTasksUpdate}
          onFavoritesChange={handleFavoritesUpdate}
        />
      </div>
    </div>
  );
};

export default Index;
