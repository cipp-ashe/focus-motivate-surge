
import { useState } from "react";
import { TaskInput } from "./TaskInput";
import { TaskTable } from "./TaskTable";
import { CompletedTasks } from "../CompletedTasks";
import { EmailSummaryModal } from "../EmailSummaryModal";
import { useTaskContext } from "@/contexts/TaskContext";
import type { Quote } from "@/types/timer";

interface TaskListProps {
  initialFavorites?: Quote[];
  onFavoritesChange?: (favorites: Quote[]) => void;
}

export const TaskList = ({
  initialFavorites = [],
  onFavoritesChange,
}: TaskListProps) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
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

  const handleEmailSent = () => {
    setIsEmailModalOpen(false);
    clearCompletedTasks();
  };

  return (
    <div className="space-y-4">
      <TaskInput onTaskAdd={addTask} />
      
      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTaskId ? [selectedTaskId] : []}
        onTaskClick={(task) => selectTask(task.id)}
        onTaskDelete={deleteTask}
        onTaskUpdate={updateTask}
        onTasksClear={clearTasks}
      />

      <CompletedTasks 
        tasks={completedTasks}
        onTasksClear={clearCompletedTasks}
      />

      <EmailSummaryModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSent}
        tasks={tasks}
        completedTasks={completedTasks}
        favorites={initialFavorites}
      />
    </div>
  );
};
