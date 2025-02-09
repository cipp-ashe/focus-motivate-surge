
import { useState, useCallback } from "react";
import { Task } from "@/components/tasks/TaskList";
import { TimerStateMetrics } from "@/types/metrics";
import { toast } from "sonner";

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

  const handleTaskAdd = useCallback((task: Task) => {
    setTasks(prev => {
      const newTasks = [...prev, task];
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    toast.success("Task added 📝✨");
  }, [onTasksUpdate]);

  const handleTaskSelect = useCallback((task: Task, event?: React.MouseEvent) => {
    if (event?.ctrlKey) return;

    const existingTask = tasks.find(t => t.id === task.id);
    if (!existingTask) return;

    const updatedTask = { ...existingTask, ...task };
    setSelectedTask(updatedTask);
    
    if (!task.duration || task.duration === existingTask.duration) {
      toast(task.name);
    }
  }, [tasks]);

  const handleTaskComplete = useCallback((metrics: TimerStateMetrics) => {
    if (!selectedTask) return;
    
    setCompletedTasks(prev => {
      const newCompleted = [...prev, {
        ...selectedTask,
        completed: true,
        metrics: metrics
      }];
      onCompletedTasksUpdate?.(newCompleted);
      return newCompleted;
    });
    
    setTasks(prev => {
      const newTasks = prev.filter(t => t.id !== selectedTask.id);
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    setSelectedTask(null);
    toast.success("Task Complete 🎯✨");
  }, [selectedTask, onTasksUpdate, onCompletedTasksUpdate]);

  const handleTasksClear = useCallback(() => {
    setTasks([]);
    onTasksUpdate?.([]);
    toast("Tasks cleared 🗑️");
  }, [onTasksUpdate]);

  const handleSelectedTasksClear = useCallback((taskIds: string[]) => {
    setTasks(prev => {
      const newTasks = prev.filter(task => !taskIds.includes(task.id));
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    if (selectedTask && taskIds.includes(selectedTask.id)) {
      setSelectedTask(null);
    }

    toast(`${taskIds.length} task${taskIds.length === 1 ? '' : 's'} removed 🗑️`);
  }, [selectedTask, onTasksUpdate]);

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
