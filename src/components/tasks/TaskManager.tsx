
import { useMemo } from "react";
import { TaskList } from "./TaskList";
import { TaskLayout } from "./TaskLayout";
import { TimerSection } from "../timer/TimerSection";
import { TaskProvider } from "@/contexts/TaskContext";
import type { Task } from "@/types/tasks";
import type { Quote } from "@/types/timer";
import { useTaskContext } from "@/contexts/TaskContext";

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
  const taskListComponent = useMemo(() => (
    <TaskList
      onFavoritesChange={onFavoritesChange}
      initialFavorites={initialFavorites}
    />
  ), [onFavoritesChange, initialFavorites]);

  const { tasks } = useTaskContext();
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

  const timerComponent = useMemo(() => (
    <TimerSection
      selectedTask={selectedTask}
      onTaskComplete={(metrics) => {
        // Handle task completion
      }}
      onDurationChange={(minutes) => {
        // Handle duration change
      }}
      favorites={initialFavorites}
      setFavorites={onFavoritesChange}
    />
  ), [selectedTask, initialFavorites, onFavoritesChange]);

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
