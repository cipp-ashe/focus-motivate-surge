
import { useEffect } from "react";
import { startOfDay, isToday } from "date-fns";
import type { Task } from "@/types/tasks";
import { toast } from "sonner";
import { eventManager } from "@/lib/events/EventManager";

interface DailySyncManagerProps {
  lastSyncDate: Date;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  onLastSyncUpdate: (date: Date) => void;
}

/**
 * Component to handle daily task synchronization and reset
 */
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
      console.log('DailySyncManager: New day detected, resetting tasks');
      
      // Get habit tasks (relationships.habitId exists)
      const habitTasks = tasks.filter(task => task.relationships?.habitId);
      
      // Reset habit tasks to uncompleted state
      const resetHabitTasks = habitTasks.map(task => ({
        ...task,
        completed: false
      }));

      // Update tasks
      onTasksUpdate(resetHabitTasks);
      onLastSyncUpdate(today);
      
      // Notify the user
      toast.info("Tasks have been reset for the new day", { duration: 3000 });
      
      // Trigger habit checks to ensure all habit tasks are created for today
      setTimeout(() => {
        console.log('DailySyncManager: Triggering habit checks for the new day');
        eventManager.emit('habits:check-pending', {});
        window.dispatchEvent(new Event('force-habits-update'));
        window.dispatchEvent(new Event('force-task-update'));
      }, 300);
    }
  }, [lastSyncDate, tasks, onTasksUpdate, onLastSyncUpdate]);

  // Render nothing - this is a behavior-only component
  return null;
};
