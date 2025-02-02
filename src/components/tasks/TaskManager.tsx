import { useState, useCallback } from "react";
import { TaskList, Task } from "../TaskList";
import { Timer } from "../timer/Timer";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { toast } from "sonner";

interface TaskManagerProps {
  initialTasks?: Task[];
  initialCompletedTasks?: Task[];
  initialFavorites?: Quote[];
  onTasksUpdate?: (tasks: Task[]) => void;
  onCompletedTasksUpdate?: (tasks: Task[]) => void;
  onFavoritesChange?: (favorites: Quote[]) => void;
}

export const TaskManager = ({
  initialTasks = [],
  initialCompletedTasks = [],
  initialFavorites = [],
  onTasksUpdate,
  onCompletedTasksUpdate,
  onFavoritesChange,
}: TaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialCompletedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>(initialFavorites);

  // Handle favorites updates
  const handleFavoritesChange = (newFavorites: Quote[]) => {
    console.log('Updating favorites:', newFavorites.length);
    setFavorites(newFavorites);
    onFavoritesChange?.(newFavorites);
  };

  // Task management handlers
  const handleTaskAdd = useCallback((task: Task) => {
    console.log('Adding task:', task.name);
    setTasks(prev => {
      const newTasks = [...prev, task];
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
  }, [onTasksUpdate]);

  const handleTaskSelect = useCallback((task: Task) => {
    console.log('Selecting task:', task.name);
    // Update tasks array if this task has different properties than stored version
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, ...task } : t
    ));
    // Update localStorage
    const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    const updatedTasks = storedTasks.map((t: Task) => t.id === task.id ? { ...t, ...task } : t);
    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
    setSelectedTask(task);
    toast(`Selected task: ${task.name}`);
  }, []);

  const handleTaskComplete = useCallback((metrics: TimerStateMetrics) => {
    console.log('TaskManager - Task completion flow:', {
      incomingMetrics: {
        originalDuration: metrics.originalDuration,
        actualDuration: metrics.actualDuration,
        netEffectiveTime: metrics.netEffectiveTime,
        pausedTime: metrics.pausedTime,
        efficiencyRatio: metrics.efficiencyRatio,
        completionStatus: metrics.completionStatus,
        pauseCount: metrics.pauseCount,
        favoriteQuotes: metrics.favoriteQuotes
      },
      selectedTask
    });
    
    if (selectedTask) {
      setCompletedTasks(prev => {
        const newCompleted = [...prev, {
          ...selectedTask,
          completed: true,
          metrics: metrics
        }];
        onCompletedTasksUpdate?.(newCompleted);
        return newCompleted;
      });
      
      setTasks(prev => {
        const newTasks = prev.filter(t => t.id !== selectedTask.id);
        onTasksUpdate?.(newTasks);
        return newTasks;
      });
      
      setSelectedTask(null);
      toast.success(`Task completed: ${selectedTask.name}`);
    }
  }, [selectedTask, onTasksUpdate, onCompletedTasksUpdate]);

  const handleTasksClear = useCallback(() => {
    console.log('Clearing all tasks');
    setTasks([]);
    onTasksUpdate?.([]);
  }, [onTasksUpdate]);

  const handleSelectedTasksClear = useCallback((taskIds: string[]) => {
    console.log('Clearing selected tasks:', taskIds);
    setTasks(prev => {
      const newTasks = prev.filter(task => !taskIds.includes(task.id));
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    if (selectedTask && taskIds.includes(selectedTask.id)) {
      setSelectedTask(null);
    }
  }, [selectedTask, onTasksUpdate]);

  const handleSummaryEmailSent = useCallback(() => {
    console.log('Sending summary email and clearing completed tasks');
    setCompletedTasks([]);
    onCompletedTasksUpdate?.([]);
    toast.success("Summary sent! Completed tasks have been cleared.");
  }, [onCompletedTasksUpdate]);

  const handleTaskDurationChange = useCallback((minutes: number) => {
    console.log('Updating task duration:', minutes);
    if (selectedTask) {
      setTasks(prev => prev.map(task =>
        task.id === selectedTask.id
          ? { ...task, duration: minutes }
          : task
      ));
    }
  }, [selectedTask]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6 order-1">
          <TaskList
            tasks={tasks}
            completedTasks={completedTasks}
            onTaskAdd={handleTaskAdd}
            onTaskSelect={handleTaskSelect}
            onTasksClear={handleTasksClear}
            onSelectedTasksClear={handleSelectedTasksClear}
            onSummaryEmailSent={handleSummaryEmailSent}
            favorites={favorites}
          />
        </div>

        <div className="space-y-4 sm:space-y-6 order-2">
          {selectedTask ? (
            <Timer
              key={selectedTask.id} // Force new instance on task change
              duration={selectedTask.duration ? selectedTask.duration * 60 : 1500}
              taskName={selectedTask.name}
              onComplete={handleTaskComplete}
              onAddTime={() => {
                console.log("Time added to task:", selectedTask.name);
              }}
              onDurationChange={handleTaskDurationChange}
              favorites={favorites}
              setFavorites={handleFavoritesChange}
            />
          ) : (
            <div className="text-center text-muted-foreground p-4 sm:p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20">
              Select a task to start the timer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TaskManager.displayName = 'TaskManager';