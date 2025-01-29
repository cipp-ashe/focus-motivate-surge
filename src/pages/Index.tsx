import { useState, useCallback, useEffect } from "react";
import { Timer } from "@/components/Timer";
import { QuoteDisplay, FavoriteQuotes } from "@/components/QuoteDisplay";
import { TaskList, Task } from "@/components/TaskList";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import the Quote type from QuoteDisplay
interface Quote {
  text: string;
  author: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [duration, setDuration] = useState(1500);
  const [isDark, setIsDark] = useState(true);
  const [favorites, setFavorites] = useState<Quote[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleTaskAdd = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const handleTaskSelect = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleTaskComplete = useCallback(() => {
    if (selectedTask) {
      setCompletedTasks((prev) => [...prev, { ...selectedTask, completed: true }]);
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      setSelectedTask(null);
    }
  }, [selectedTask]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Focus Timer
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full hover:bg-primary/20"
          >
            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TaskList
              tasks={tasks}
              completedTasks={completedTasks}
              onTaskAdd={handleTaskAdd}
              onTaskSelect={handleTaskSelect}
            />
            <FavoriteQuotes favorites={favorites} />
          </div>

          <div className="space-y-6">
            {selectedTask ? (
              <Timer
                duration={duration}
                taskName={selectedTask.name}
                onComplete={handleTaskComplete}
                onAddTime={() => {}}
                onDurationChange={setDuration}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <div className="text-center text-muted-foreground p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20">
                Select a task to start the timer
              </div>
            )}
            <QuoteDisplay favorites={favorites} setFavorites={setFavorites} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;