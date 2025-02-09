
import { TaskInput } from "./TaskInput";
import { TaskTable } from "./TaskTable";
import { CompletedTasks } from "../CompletedTasks";
import { useAppState, useAppStateActions } from "@/contexts/AppStateContext";
import { HabitTaskManager } from "../habits/HabitTaskManager";
import { useTemplateManagement } from "@/components/habits/hooks/useTemplateManagement";
import type { Quote } from "@/types/timer";

interface TaskListProps {
  initialFavorites?: Quote[];
  onFavoritesChange?: (favorites: Quote[]) => void;
}

export const TaskList = ({
  initialFavorites = [],
  onFavoritesChange,
}: TaskListProps) => {
  const state = useAppState();
  const actions = useAppStateActions();
  const { tasks: { items: tasks, completed: completedTasks, selected: selectedTaskId } } = state;

  const { activeTemplates } = useTemplateManagement();

  return (
    <div className="space-y-4">
      <TaskInput onTaskAdd={(task) => actions.addTask(task)} />
      
      <HabitTaskManager 
        activeTemplates={activeTemplates}
      />

      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTaskId ? [selectedTaskId] : []}
        onTaskClick={(task) => actions.selectTask(task.id)}
        onTaskDelete={actions.deleteTask}
        onTasksUpdate={actions.updateTask}
        onTasksClear={() => {
          tasks.forEach(task => actions.deleteTask(task.id));
        }}
      />

      <CompletedTasks 
        tasks={completedTasks}
        onTasksClear={() => {
          completedTasks.forEach(task => actions.deleteTask(task.id));
        }}
      />
    </div>
  );
};
