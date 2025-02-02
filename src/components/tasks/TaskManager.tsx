import { useState, useCallback } from "react";
import { TaskList, Task } from "../TaskList";
import { TimerSection } from "./TimerSection";
import { Quote } from "@/types/timer";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { toast } from "@/hooks/use-toast";

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
  const [favorites, setFavorites] = useState<Quote[]>(initialFavorites);
  
  const {
    tasks,
    setTasks,
    completedTasks,
    selectedTask,
    handleTaskAdd,
    handleTaskSelect,
    handleTaskComplete,
    handleTasksClear,
    handleSelectedTasksClear,
  } = useTaskOperations({
    initialTasks,
    initialCompletedTasks,
    onTasksUpdate,
    onCompletedTasksUpdate,
  });

  const handleFavoritesChange = (newFavorites: Quote[]) => {
    console.log('Updating favorites:', newFavorites.length);
    setFavorites(newFavorites);
    onFavoritesChange?.(newFavorites);
  };

  const handleSummaryEmailSent = useCallback(() => {
    console.log('Sending summary email and clearing completed tasks');
    onCompletedTasksUpdate?.([]);
    toast({
      title: "Summary Sent",
      description: "Completed tasks have been cleared."
    });
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
  }, [selectedTask, setTasks]);

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
          <TimerSection
            selectedTask={selectedTask}
            onTaskComplete={handleTaskComplete}
            onDurationChange={handleTaskDurationChange}
            favorites={favorites}
            setFavorites={handleFavoritesChange}
          />
        </div>
      </div>
    </div>
  );
};

TaskManager.displayName = 'TaskManager';