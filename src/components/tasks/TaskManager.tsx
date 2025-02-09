
import { useMemo } from "react";
import { TaskList } from "./TaskList";
import { TaskLayout } from "./TaskLayout";
import { TimerSection } from "../timer/TimerSection";
import type { Quote } from "@/types/timer";
import { useAppState, useAppStateActions } from "@/contexts/AppStateContext";

interface TaskManagerProps {
  initialFavorites?: Quote[];
  onFavoritesChange?: (favorites: Quote[]) => void;
}

export const TaskManager = ({
  initialFavorites = [],
  onFavoritesChange,
}: TaskManagerProps) => {
  const state = useAppState();
  const { tasks: { items: tasks, selected: selectedTaskId } } = state;
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;

  const taskListComponent = useMemo(() => (
    <TaskList
      initialFavorites={initialFavorites}
      onFavoritesChange={onFavoritesChange}
    />
  ), [onFavoritesChange, initialFavorites]);

  const timerComponent = useMemo(() => (
    <TimerSection
      selectedTask={selectedTask}
      onTaskComplete={(metrics) => {
        // Handle task completion
        console.log("Task completed with metrics:", metrics);
      }}
      onDurationChange={(minutes) => {
        // Handle duration change
        console.log("Duration changed to:", minutes);
      }}
      favorites={initialFavorites}
      setFavorites={onFavoritesChange}
    />
  ), [initialFavorites, onFavoritesChange, selectedTask]);

  return (
    <TaskLayout
      timer={timerComponent}
      taskList={taskListComponent}
    />
  );
};
