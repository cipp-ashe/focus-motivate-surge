import { useState, useCallback, useEffect } from "react";
import { Timer } from "@/components/Timer";
import { QuoteDisplay, FavoriteQuotes } from "@/components/QuoteDisplay";
import { TaskList, Task } from "@/components/TaskList";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Quote {
  text: string;
  author: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('taskList');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });
  
  const [completedTasks, setCompletedTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('completedTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      return [];
    }
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [duration, setDuration] = useState(1500); // Default to 25 minutes

  useEffect(() => {
    if (selectedTask?.duration) {
      console.log('Setting duration from selected task:', selectedTask.duration * 60);
      setDuration(selectedTask.duration * 60);
    } else {
      console.log('Setting default duration of 25 minutes');
      setDuration(1500); // 25 minutes default
    }
  }, [selectedTask]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const [isDark, setIsDark] = useState(true);
  const [favorites, setFavorites] = useState<Quote[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleTaskAdd = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const handleTaskSelect = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const handleTaskComplete = useCallback(() => {
    if (selectedTask) {
      setCompletedTasks((prev) => [...prev, { ...selectedTask, completed: true }]);
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      setSelectedTask(null);
    }
  }, [selectedTask]);

  const handleTasksClear = useCallback(() => {
    setTasks([]);
    setCompletedTasks([]);
    setSelectedTask(null);
  }, []);

  const handleSelectedTasksClear = useCallback((taskIds: string[]) => {
    setTasks(prev => prev.filter(task => !taskIds.includes(task.id)));
    setSelectedTask(prev => prev && taskIds.includes(prev.id) ? null : prev);
  }, []);

  // Listen for task updates
  useEffect(() => {
    const handleTasksUpdate = (event: CustomEvent<{ tasks: Task[] }>) => {
      setTasks(event.detail.tasks);
    };

    window.addEventListener('tasksUpdated', handleTasksUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tasksUpdated', handleTasksUpdate as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Focus Timer
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full hover:bg-primary/20"
          >
            {isDark ? <Sun className="h-5 w-5 sm:h-6 sm:w-6" /> : <Moon className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6 order-1">
            <TaskList
              tasks={tasks}
              completedTasks={completedTasks}
              onTaskAdd={handleTaskAdd}
              onTaskSelect={handleTaskSelect}
              onTasksClear={handleTasksClear}
              onSelectedTasksClear={handleSelectedTasksClear}
              favorites={favorites}
            />
          </div>

          <div className="space-y-4 sm:space-y-6 order-2 mb-6">
            {selectedTask ? (
              <Timer
                duration={duration}
                taskName={selectedTask.name}
                onComplete={handleTaskComplete}
                onAddTime={() => {}}
                onDurationChange={(minutes) => {
                  console.log('Duration changed to:', minutes * 60);
                  setDuration(minutes * 60);
                }}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <div className="text-center text-muted-foreground p-4 sm:p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20">
                Select a task to start the timer
              </div>
            )}
            <QuoteDisplay favorites={favorites} setFavorites={setFavorites} />
          </div>
        </div>
        
        <div className="mt-8">
          <FavoriteQuotes favorites={favorites} />
        </div>
      </div>
    </div>
  );
};

export default Index;