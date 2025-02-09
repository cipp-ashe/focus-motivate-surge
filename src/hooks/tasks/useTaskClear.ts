
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
    setSelectedTask(null);
    if (onTasksUpdate) {
      onTasksUpdate([]);
    }
    toast("Tasks cleared 🗑️");
  }, [onTasksUpdate, setTasks, setSelectedTask]);

  const handleSelectedTasksClear = useCallback((taskIds: string[]) => {
    if (!taskIds.length) return;

    setTasks(prev => {
      const newTasks = prev.filter(task => !taskIds.includes(task.id));
      // Update tasks immediately after state change
      if (onTasksUpdate) {
        onTasksUpdate(newTasks);
      }
      return newTasks;
    });
    
    // Clear selected task if it was deleted
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

