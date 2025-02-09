
import { TaskInput } from "./TaskInput";
import { TaskTable } from "./TaskTable";
import { CompletedTasks } from "../CompletedTasks";
import { useTaskContext } from "@/contexts/TaskContext";
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
  const {
    tasks,
    completedTasks,
    selectedTaskId,
    addTask,
    updateTask,
    deleteTask,
    selectTask,
    clearTasks,
    clearCompletedTasks,
  } = useTaskContext();

  const { activeTemplates } = useTemplateManagement();

  return (
    <div className="space-y-4">
      <TaskInput onTaskAdd={addTask} />
      
      <HabitTaskManager 
        activeTemplates={activeTemplates}
      />

      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTaskId ? [selectedTaskId] : []}
        onTaskClick={(task) => selectTask(task.id)}
        onTaskDelete={deleteTask}
        onTasksUpdate={updateTask}
        onTasksClear={clearTasks}
      />

      <CompletedTasks 
        tasks={completedTasks}
        onTasksClear={clearCompletedTasks}
      />
    </div>
  );
};
