import { useMemo } from "react";
import { TaskList } from "./TaskList";
import { TaskLayout } from "./TaskLayout";
import { TimerSection } from "../timer/TimerSection";
import { TaskProvider } from "@/contexts/TaskContext";
import type { Quote } from "@/types/timer";

interface TaskManagerProps {
  initialFavorites?: Quote[];
  onFavoritesChange?: (favorites: Quote[]) => void;
}

export const TaskManager = ({
  initialFavorites = [],
  onFavoritesChange,
}: TaskManagerProps) => {
  const taskListComponent = useMemo(() => (
    <TaskList
      initialFavorites={initialFavorites}
      onFavoritesChange={onFavoritesChange}
    />
  ), [onFavoritesChange, initialFavorites]);

  const timerComponent = useMemo(() => (
    <TimerSection
      selectedTask={null}
      onTaskComplete={(metrics) => {
        // Handle task completion
      }}
      onDurationChange={(minutes) => {
        // Handle duration change
      }}
      favorites={initialFavorites}
      setFavorites={onFavoritesChange}
    />
  ), [initialFavorites, onFavoritesChange]);

  return (
    <TaskProvider>
      <TaskLayout
        timer={timerComponent}
        taskList={taskListComponent}
      />
    </TaskProvider>
  );
};
