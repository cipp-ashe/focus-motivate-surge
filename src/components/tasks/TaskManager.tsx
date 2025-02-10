
import { useMemo } from "react";
import { TaskList } from "./TaskList";
import { TaskLayout } from "./TaskLayout";
import { TimerSection } from "@/components/timer";
import type { Quote } from "@/types/timer";
import { useAppState, useAppStateActions } from "@/contexts/AppStateContext";
import type { TaskMetrics } from "@/types/tasks";

interface TaskManagerProps {
  initialFavorites?: Quote[];
  onFavoritesChange?: (favorites: Quote[]) => void;
}

export const TaskManager = ({
  initialFavorites = [],
  onFavoritesChange,
}: TaskManagerProps) => {
  const state = useAppState();
  const actions = useAppStateActions();
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
        if (selectedTask) {
          const taskMetrics: TaskMetrics = {
            expectedTime: metrics.expectedTime,
            actualDuration: metrics.actualDuration,
            pauseCount: metrics.pauseCount,
            favoriteQuotes: metrics.favoriteQuotes,
            pausedTime: metrics.pausedTime,
            extensionTime: metrics.extensionTime,
            netEffectiveTime: metrics.netEffectiveTime,
            efficiencyRatio: metrics.efficiencyRatio,
            completionStatus: metrics.completionStatus
          };
          actions.completeTask(selectedTask.id, taskMetrics);
        }
      }}
      onDurationChange={(minutes) => {
        if (selectedTask) {
          const newDuration = minutes * 60; // Convert to seconds
          actions.updateTask(selectedTask.id, { duration: newDuration });
        }
      }}
      favorites={initialFavorites}
      setFavorites={onFavoritesChange}
    />
  ), [initialFavorites, onFavoritesChange, selectedTask, actions]);

  return (
    <TaskLayout
      timer={timerComponent}
      taskList={taskListComponent}
    />
  );
};
