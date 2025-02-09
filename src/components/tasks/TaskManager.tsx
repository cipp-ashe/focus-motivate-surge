
import { useState, useCallback, useMemo } from "react";
import { TaskList, Task } from "./TaskList";
import { TaskLayout } from "./TaskLayout";
import { TimerSection } from "../timer/TimerSection";
import { Quote } from "@/types/timer";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { toast } from "sonner";

interface TaskManagerProps {
  initialTasks?: Task[];
  initialCompletedTasks?: Task[];
  initialFavorites?: Quote[];
  onTasksUpdate?: (tasks: Task[]) => void;
  onCompletedTasksUpdate?: (tasks: Task[]) => void;
  onFavoritesChange?: (favorites: Quote[]) => void;
  selectedTaskId?: string | null;
  onTaskSelect?: (taskId: string | null) => void;
}

export const TaskManager = ({
  initialTasks = [],
  initialCompletedTasks = [],
  initialFavorites = [],
  onTasksUpdate,
  onCompletedTasksUpdate,
  onFavoritesChange,
  selectedTaskId,
  onTaskSelect,
}: TaskManagerProps) => {
  const [favorites, setFavorites] = useState<Quote[]>(initialFavorites);
  
  const {
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
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

  // Find the selected task based on selectedTaskId
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find(task => task.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  const handleTaskSelection = useCallback((task: Task) => {
    handleTaskSelect(task);
    onTaskSelect?.(task.id);
  }, [handleTaskSelect, onTaskSelect]);

  const handleFavoritesChange = (newFavorites: Quote[]) => {
    setFavorites(newFavorites);
    onFavoritesChange?.(newFavorites);
  };

  const handleSummaryEmailSent = useCallback(() => {
    setCompletedTasks([]);
    onCompletedTasksUpdate?.([]);
    toast.success("Summary sent ✨");
  }, [onCompletedTasksUpdate, setCompletedTasks]);

  const handleTaskDurationChange = useCallback((minutes: number) => {
    if (selectedTask) {
      setTasks(prev => prev.map(task =>
        task.id === selectedTask.id
          ? { ...task, duration: minutes }
          : task
      ));
    }
  }, [selectedTask, setTasks]);

  const taskListComponent = useMemo(() => (
    <TaskList
      tasks={tasks}
      completedTasks={completedTasks}
      onTaskAdd={handleTaskAdd}
      onTaskSelect={handleTaskSelection}
      onTasksClear={handleTasksClear}
      onSelectedTasksClear={handleSelectedTasksClear}
      onSummaryEmailSent={handleSummaryEmailSent}
      favorites={favorites}
      onTasksUpdate={onTasksUpdate}
    />
  ), [tasks, completedTasks, handleTaskAdd, handleTaskSelection, handleTasksClear, 
      handleSelectedTasksClear, handleSummaryEmailSent, favorites, onTasksUpdate]);

  const timerComponent = useMemo(() => (
    <TimerSection
      selectedTask={selectedTask}
      onTaskComplete={handleTaskComplete}
      onDurationChange={handleTaskDurationChange}
      favorites={favorites}
      setFavorites={handleFavoritesChange}
    />
  ), [selectedTask, handleTaskComplete, handleTaskDurationChange, favorites, handleFavoritesChange]);

  return (
    <TaskLayout
      timer={timerComponent}
      taskList={taskListComponent}
    />
  );
};

TaskManager.displayName = 'TaskManager';

