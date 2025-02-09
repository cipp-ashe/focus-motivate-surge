
import { useState } from "react";
import { Task } from "@/components/tasks/TaskList";
import { useTaskAdd } from "./tasks/useTaskAdd";
import { useTaskSelect } from "./tasks/useTaskSelect";
import { useTaskComplete } from "./tasks/useTaskComplete";
import { useTaskClear } from "./tasks/useTaskClear";

export const useTaskOperations = ({
  initialTasks = [],
  initialCompletedTasks = [],
  onTasksUpdate,
  onCompletedTasksUpdate,
}: {
  initialTasks?: Task[];
  initialCompletedTasks?: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
  onCompletedTasksUpdate?: (tasks: Task[]) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialCompletedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskAdd = useTaskAdd(setTasks, onTasksUpdate);
  const handleTaskSelect = useTaskSelect(tasks, setSelectedTask);
  const handleTaskComplete = useTaskComplete(
    selectedTask,
    setTasks,
    setCompletedTasks,
    setSelectedTask,
    onTasksUpdate,
    onCompletedTasksUpdate
  );
  const { handleTasksClear, handleSelectedTasksClear } = useTaskClear(
    setTasks,
    setSelectedTask,
    onTasksUpdate
  );

  return {
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    selectedTask,
    handleTaskAdd,
    handleTaskSelect,
    handleTaskComplete,
    handleTasksClear,
    handleSelectedTasksClear,
  };
};
