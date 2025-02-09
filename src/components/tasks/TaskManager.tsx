
import { useMemo } from "react";
import { TaskList } from "./TaskList";
import { TaskLayout } from "./TaskLayout";
import { TimerSection } from "../timer/TimerSection";
import { TaskProvider } from "@/contexts/TaskContext";
import type { Task } from "@/types/tasks";
import type { Quote } from "@/types/timer";

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
  const taskListComponent = useMemo(() => (
    <TaskList
      onFavoritesChange={onFavoritesChange}
      initialFavorites={initialFavorites}
    />
  ), [onFavoritesChange, initialFavorites]);

  const timerComponent = useMemo(() => (
    <TimerSection
      favorites={initialFavorites}
      setFavorites={onFavoritesChange}
    />
  ), [initialFavorites, onFavoritesChange]);

  return (
    <TaskProvider
      initialTasks={initialTasks}
      initialCompletedTasks={initialCompletedTasks}
      onTasksUpdate={onTasksUpdate}
      onCompletedTasksUpdate={onCompletedTasksUpdate}
    >
      <TaskLayout
        timer={timerComponent}
        taskList={taskListComponent}
      />
    </TaskProvider>
  );
};

TaskManager.displayName = 'TaskManager';
