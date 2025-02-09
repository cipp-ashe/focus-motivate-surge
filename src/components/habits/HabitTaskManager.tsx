
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import type { Task } from "@/components/tasks/TaskList";
import type { ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";

interface HabitTaskManagerProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ tasks, onTasksUpdate, activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);

  // Convert timer-type habits into tasks
  useEffect(() => {
    // Get existing non-habit tasks
    const nonHabitTasks = tasks.filter(task => !task.id.startsWith('habit-'));
    
    // Convert timer habits to tasks with proper duration handling
    const timerHabits = todaysHabits.filter(habit => 
      habit.metrics.type === 'timer' && 
      habit.metrics.target && 
      habit.metrics.target > 0
    );
    
    if (timerHabits.length > 0) {
      console.log('Converting timer habits to tasks:', timerHabits);
      
      const habitTasks: Task[] = timerHabits.map(habit => {
        // Ensure we have a valid number for the duration
        const targetMinutes = typeof habit.metrics.target === 'number' 
          ? habit.metrics.target 
          : parseInt(String(habit.metrics.target));

        // Log duration conversion details
        console.log(`Converting habit duration for ${habit.name}:`, {
          originalTarget: habit.metrics.target,
          parsedMinutes: targetMinutes,
          finalDuration: targetMinutes
        });

        // Ensure target is valid and greater than 0
        if (isNaN(targetMinutes) || targetMinutes <= 0) {
          console.warn(`Invalid duration for habit ${habit.name}:`, {
            target: habit.metrics.target,
            parsed: targetMinutes
          });
          return null;
        }

        return {
          id: `habit-${habit.id}`,
          name: habit.name,
          completed: false,
          duration: targetMinutes, // Keep duration in minutes, not seconds
          createdAt: new Date().toISOString(),
          tags: [{ name: 'Habit', color: 'blue' }],
        };
      }).filter(Boolean) as Task[];

      const newTasks = [...nonHabitTasks, ...habitTasks];
      const currentTasksStr = JSON.stringify(tasks);
      const newTasksStr = JSON.stringify(newTasks);
      
      // Only update if the tasks have actually changed
      if (currentTasksStr !== newTasksStr) {
        console.log('Updating tasks with converted habits:', newTasks);
        onTasksUpdate(newTasks);
      }
    }
  }, [todaysHabits]); // Remove tasks from dependency array to prevent infinite loop

  return null;
};

