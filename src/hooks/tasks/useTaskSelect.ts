import { useCallback } from "react";
import { Task } from "@/components/tasks/TaskList";
import { toast } from "sonner";

export const useTaskSelect = (
  tasks: Task[],
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
) => {
  const handleTaskSelect = useCallback((task: Task, event?: React.MouseEvent) => {
    if (event?.ctrlKey) return;

    const existingTask = tasks.find(t => t.id === task.id);
    if (!existingTask) return;

    // Keep the duration as-is from the task, don't modify it
    const updatedTask = { ...existingTask, ...task };
    setSelectedTask(updatedTask);
    
    if (!task.duration || task.duration === existingTask.duration) {
      toast(task.name);
    }
  }, [tasks, setSelectedTask]);

  return handleTaskSelect;
};
