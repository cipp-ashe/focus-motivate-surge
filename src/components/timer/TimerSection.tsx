
import { Timer } from "./Timer";
import { Task } from "@/types/tasks";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { Timer as TimerIcon, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { eventBus } from "@/lib/eventBus";
import { useEvent } from "@/hooks/useEvent";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface TimerSectionProps {
  selectedTask: Task | null;
  favorites: Quote[];
  setFavorites: (favorites: Quote[]) => void;
}

export const TimerSection = ({
  selectedTask,
  favorites,
  setFavorites,
}: TimerSectionProps) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(selectedTask);

  // Debug: Log props
  useEffect(() => {
    console.log("TimerSection rendered with selectedTask:", selectedTask);
  }, [selectedTask]);

  // Listen for timer:set-task events to update the current task
  useEvent('timer:set-task', (task: Task) => {
    console.log("TimerSection: Received timer:set-task event", task);
    setCurrentTask(task);
  });

  // Also listen for task:select events directly
  useEvent('task:select', (taskId: string) => {
    console.log("TimerSection: Received task:select event for", taskId);
    
    // Find the task in local storage to get its details
    try {
      const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
      const task = taskList.find((t: Task) => t.id === taskId);
      
      if (task) {
        console.log("TimerSection: Found task in localStorage:", task);
        setCurrentTask(task);
        
        // Show toast for debugging
        toast.success(`Selected task: ${task.name}`);
      } else {
        console.warn("TimerSection: Task not found in localStorage:", taskId);
      }
    } catch (e) {
      console.error("TimerSection: Error processing task:select event", e);
    }
  });

  // Update current task when selectedTask changes
  useEffect(() => {
    if (selectedTask && (!currentTask || selectedTask.id !== currentTask.id)) {
      console.log("TimerSection: Selected task changed", selectedTask);
      setCurrentTask(selectedTask);
    }
  }, [selectedTask, currentTask]);

  if (!currentTask) {
    return (
      <Card className="shadow-md border-border/20 overflow-hidden">
        <CardHeader className="bg-card/70 border-b border-border/10 py-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
            <TimerIcon className="h-5 w-5 text-purple-400" />
            Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-card/50 py-16">
          <div className="text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center mb-8">
              <TimerIcon className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl text-muted-foreground font-medium mb-3">Select a task to start the timer</h3>
            <p className="text-sm text-muted-foreground/70">
              Choose a task from the list above
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const durationInSeconds = currentTask.duration || 1500;
  
  const handleTaskComplete = (metrics: TimerStateMetrics) => {
    console.log("TimerSection: Task completed", currentTask.id, metrics);
    eventBus.emit('task:complete', { taskId: currentTask.id, metrics });
  };
  
  const handleDurationChange = (minutes: number) => {
    console.log("TimerSection: Duration changed to", minutes, "minutes");
    const seconds = minutes * 60;
    eventBus.emit('task:update', { 
      taskId: currentTask.id, 
      updates: { duration: seconds } 
    });
  };

  return (
    <Card className="shadow-md border-border/20 overflow-hidden">
      <Timer
        key={`timer-${currentTask.id}-${durationInSeconds}`}
        duration={durationInSeconds}
        taskName={currentTask.name}
        onComplete={handleTaskComplete}
        onAddTime={() => {
          console.log("Time added to task:", currentTask.name);
        }}
        onDurationChange={handleDurationChange}
        favorites={favorites}
        setFavorites={setFavorites}
      />
    </Card>
  );
};
