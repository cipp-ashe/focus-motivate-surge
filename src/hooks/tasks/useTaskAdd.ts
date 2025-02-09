
import { useCallback } from "react";
import { Task } from "@/types/tasks";
import { toast } from "sonner";

export const useTaskAdd = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onTasksUpdate?: (tasks: Task[]) => void
) => {
  const handleTaskAdd = useCallback((task: Task) => {
    setTasks(prev => {
      const newTasks = [...prev, task];
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    toast.success("Task added 📝✨");
  }, [onTasksUpdate, setTasks]);

  return handleTaskAdd;
};
