
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
import { toast } from "sonner";

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
  useEffect(() => {
    const handleTimerSetTask = (event: CustomEvent) => {
      console.log("TimerSection: Received timer:set-task event", event.detail);
      const task = event.detail as Task;
      
      // Only accept timer tasks
      if (task && task.taskType === 'timer') {
        setCurrentTask(task);
      } else {
        console.warn("TimerSection: Ignoring non-timer task:", task);
        toast.warning("Only timer tasks can be used in the Timer view");
      }
    };
    
    // Listen for the event
    window.addEventListener('timer:set-task', handleTimerSetTask as EventListener);
    
    // Also subscribe to the event bus
    const unsubscribe = eventBus.on('timer:set-task', (task: Task) => {
      console.log("TimerSection: Received timer:set-task event from bus", task);
      
      // Only accept timer tasks
      if (task.taskType === 'timer') {
        setCurrentTask(task);
      } else {
        console.warn("TimerSection: Ignoring non-timer task:", task);
        toast.warning("Only timer tasks can be used in the Timer view");
      }
    });
    
    return () => {
      window.removeEventListener('timer:set-task', handleTimerSetTask as EventListener);
      unsubscribe();
    };
  }, []);

  // Also listen for task:select events directly
  useEffect(() => {
    const handleTaskSelect = (event: CustomEvent) => {
      const taskId = event.detail as string;
      console.log("TimerSection: Received task:select DOM event for", taskId);
      
      // Find the task in local storage to get its details
      try {
        const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
        const task = taskList.find((t: Task) => t.id === taskId);
        
        if (task) {
          console.log("TimerSection: Found task in localStorage:", task);
          
          // Only accept timer tasks
          if (task.taskType === 'timer') {
            setCurrentTask(task);
            toast.success(`Selected timer task: ${task.name}`);
          } else {
            console.warn("TimerSection: Ignoring non-timer task:", task);
            toast.warning("Only timer tasks can be used in the Timer view");
          }
        } else {
          console.warn("TimerSection: Task not found in localStorage:", taskId);
        }
      } catch (e) {
        console.error("TimerSection: Error processing task:select event", e);
      }
    };
    
    // Subscribe to the event bus
    const unsubscribe = eventBus.on('task:select', (taskId: string) => {
      console.log("TimerSection: Received task:select event for", taskId);
      
      // Find the task in local storage to get its details
      try {
        const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
        const task = taskList.find((t: Task) => t.id === taskId);
        
        if (task) {
          console.log("TimerSection: Found task in localStorage:", task);
          
          // Only accept timer tasks
          if (task.taskType === 'timer') {
            setCurrentTask(task);
            toast.success(`Selected timer task: ${task.name}`);
          } else {
            console.warn("TimerSection: Ignoring non-timer task:", task);
            toast.warning("Only timer tasks can be used in the Timer view");
          }
        } else {
          console.warn("TimerSection: Task not found in localStorage:", taskId);
        }
      } catch (e) {
        console.error("TimerSection: Error processing task:select event", e);
      }
    });

    // Listen for DOM events as well
    window.addEventListener('task:select', handleTaskSelect as EventListener);
    
    return () => {
      window.removeEventListener('task:select', handleTaskSelect as EventListener);
      unsubscribe();
    };
  }, []);

  // Update current task when selectedTask changes
  useEffect(() => {
    if (selectedTask && (!currentTask || selectedTask.id !== currentTask.id)) {
      // Only accept timer tasks
      if (selectedTask.taskType === 'timer') {
        console.log("TimerSection: Selected task changed", selectedTask);
        setCurrentTask(selectedTask);
      } else {
        console.warn("TimerSection: Ignoring non-timer selected task:", selectedTask);
      }
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
    
    // Ensure metrics has all the required fields for task metrics
    const taskMetrics = {
      ...metrics,
      // Ensure we have a string[] for favoriteQuotes
      favoriteQuotes: Array.isArray(metrics.favoriteQuotes) ? metrics.favoriteQuotes : [],
      // Add the completion date
      completionDate: new Date().toISOString(),
      // Map timer metrics to task metrics format
      timeSpent: metrics.actualDuration,
      expectedTime: metrics.expectedTime,
      actualDuration: metrics.actualDuration,
      pauseCount: metrics.pauseCount,
      pausedTime: metrics.pausedTime,
      extensionTime: metrics.extensionTime,
      netEffectiveTime: metrics.netEffectiveTime,
      efficiencyRatio: metrics.efficiencyRatio,
      completionStatus: metrics.completionStatus,
    };
    
    // Emit the task:complete event with the enriched metrics
    eventBus.emit('task:complete', { taskId: currentTask.id, metrics: taskMetrics });
    
    // Log the complete metrics for debugging
    console.log("TimerSection: Emitted task:complete with metrics:", taskMetrics);
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
