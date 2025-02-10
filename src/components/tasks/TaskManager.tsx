
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
  
  const selectedTask = useMemo(() => 
    tasks.find(task => task.id === selectedTaskId) || null
  , [tasks, selectedTaskId]);

  console.log('TaskManager - Current state:', {
    selectedTaskId,
    selectedTask: selectedTask ? {
      id: selectedTask.id,
      name: selectedTask.name,
      duration: selectedTask.duration,
      durationInMinutes: selectedTask.duration ? Math.floor(selectedTask.duration / 60) : 25
    } : null,
    allTasks: tasks.map(t => ({ 
      id: t.id, 
      name: t.name, 
      duration: t.duration,
      durationInMinutes: t.duration ? Math.floor(t.duration / 60) : 25
    }))
  });

  const taskListComponent = useMemo(() => (
    <TaskList
      initialFavorites={initialFavorites}
      onFavoritesChange={onFavoritesChange}
    />
  ), [onFavoritesChange, initialFavorites]);

  const timerComponent = useMemo(() => (
    <TimerSection
      key={`timer-section-${selectedTask?.id}-${selectedTask?.duration}`}
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
      onDurationChange={(seconds) => {
        if (selectedTask) {
          console.log('TaskManager - Updating duration:', { 
            taskId: selectedTask.id, 
            newDurationSeconds: seconds,
            currentTask: selectedTask,
            selectedTaskId
          });
          
          actions.updateTask(selectedTask.id, { duration: seconds });
        }
      }}
      favorites={initialFavorites}
      setFavorites={onFavoritesChange}
    />
  ), [selectedTask, actions, initialFavorites, onFavoritesChange]);

  return (
    <TaskLayout
      timer={timerComponent}
      taskList={taskListComponent}
    />
  );
};

