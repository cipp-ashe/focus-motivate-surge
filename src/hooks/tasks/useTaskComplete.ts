
import { useCallback } from "react";
import { Task } from "@/types/tasks";
import { TimerStateMetrics } from "@/types/metrics";
import { toast } from "sonner";

export const useTaskComplete = (
  selectedTask: Task | null,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>,
  onTasksUpdate?: (tasks: Task[]) => void,
  onCompletedTasksUpdate?: (tasks: Task[]) => void
) => {
  const handleTaskComplete = useCallback((metrics: TimerStateMetrics) => {
    if (!selectedTask) return;
    
    setCompletedTasks(prev => {
      const formattedMetrics = {
        expectedTime: metrics.expectedTime ?? 0,
        actualDuration: metrics.actualDuration ?? 0,
        pauseCount: metrics.pauseCount ?? 0,
        favoriteQuotes: metrics.favoriteQuotes ?? 0,
        pausedTime: metrics.pausedTime ?? 0,
        extensionTime: metrics.extensionTime ?? 0,
        netEffectiveTime: metrics.netEffectiveTime ?? 0,
        efficiencyRatio: metrics.efficiencyRatio ?? 100,
        completionStatus: metrics.completionStatus ?? 'Completed On Time',
        endTime: metrics.endTime ? metrics.endTime.toISOString() : undefined,
      };
      
      const newCompleted = [...prev, {
        ...selectedTask,
        completed: true,
        metrics: formattedMetrics,
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
  }, [selectedTask, onTasksUpdate, onCompletedTasksUpdate, setTasks, setCompletedTasks, setSelectedTask]);

  return handleTaskComplete;
};
