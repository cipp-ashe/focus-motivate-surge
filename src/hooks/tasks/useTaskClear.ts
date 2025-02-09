
import { useCallback } from "react";
import { Task } from "@/components/tasks/TaskList";
import { toast } from "sonner";

export const useTaskClear = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>,
  onTasksUpdate?: (tasks: Task[]) => void
) => {
  const handleTasksClear = useCallback(() => {
    setTasks([]);
    onTasksUpdate?.([]);
    toast("Tasks cleared 🗑️");
  }, [onTasksUpdate, setTasks]);

  const handleSelectedTasksClear = useCallback((taskIds: string[]) => {
    setTasks(prev => {
      const newTasks = prev.filter(task => !taskIds.includes(task.id));
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    setSelectedTask(prev => {
      if (prev && taskIds.includes(prev.id)) {
        return null;
      }
      return prev;
    });

    toast(`${taskIds.length} task${taskIds.length === 1 ? '' : 's'} removed 🗑️`);
  }, [onTasksUpdate, setTasks, setSelectedTask]);

  return { handleTasksClear, handleSelectedTasksClear };
};
