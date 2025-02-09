
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

        // Convert minutes to seconds, default to 25 minutes if parsing fails
        const durationInSeconds = !isNaN(targetMinutes) 
          ? targetMinutes * 60 
          : 25 * 60;

        return {
          id: `habit-${habit.id}`,
          name: habit.name,
          completed: false,
          duration: durationInSeconds,
          createdAt: new Date().toISOString(),
          tags: [{ name: 'Habit', color: 'blue' }],
        };
      });

      const newTasks = [...nonHabitTasks, ...habitTasks];
      const currentTasksStr = JSON.stringify(tasks);
      const newTasksStr = JSON.stringify(newTasks);
      
      // Only update if the tasks have actually changed
      if (currentTasksStr !== newTasksStr) {
        console.log('Updating tasks with converted habits:', newTasks);
        onTasksUpdate(newTasks);
      }
    }
  }, [todaysHabits, tasks, onTasksUpdate]);

  return null;
};
