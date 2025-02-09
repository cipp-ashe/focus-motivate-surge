
import { useEffect } from "react";
import { startOfDay, isToday } from "date-fns";
import type { Task } from "@/components/tasks/TaskList";
import { toast } from "sonner";

interface DailySyncManagerProps {
  lastSyncDate: Date;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  onLastSyncUpdate: (date: Date) => void;
}

export const DailySyncManager = ({ 
  lastSyncDate, 
  tasks, 
  onTasksUpdate, 
  onLastSyncUpdate 
}: DailySyncManagerProps) => {
  // Check if we need to reset tasks for a new day
  useEffect(() => {
    const today = startOfDay(new Date());
    const lastSync = startOfDay(new Date(lastSyncDate));

    if (!isToday(lastSync)) {
      // Clear non-habit tasks and reset habit tasks for the new day
      const habitTasks = tasks.filter(task => task.id.startsWith('habit-'));
      const resetHabitTasks = habitTasks.map(task => ({
        ...task,
        completed: false
      }));

      onTasksUpdate(resetHabitTasks);
      onLastSyncUpdate(today);
      toast.info("Tasks have been reset for the new day");
    }
  }, [lastSyncDate, tasks, onTasksUpdate, onLastSyncUpdate]);

  return null;
};
