
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import type { Task } from "@/components/tasks/TaskList";
import type { ActiveTemplate } from "@/components/habits/types";

interface HabitTaskManagerProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ tasks, onTasksUpdate, activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);

  useEffect(() => {
    // Get existing non-habit tasks
    const nonHabitTasks = tasks.filter(task => !task.id.startsWith('habit-'));
    
    // Convert timer habits to tasks
    const timerHabits = todaysHabits.filter(habit => 
      habit.metrics.type === 'timer' && habit.metrics.target
    );
    
    if (timerHabits.length > 0) {
      console.log('Converting timer habits to tasks:', timerHabits);
      
      const habitTasks: Task[] = timerHabits.map(habit => {
        const seconds = habit.metrics.target || 0;
        
        console.log(`Converting habit duration for ${habit.name}:`, {
          target: seconds,
          duration: seconds, // Duration is already in seconds
        });

        if (!seconds || seconds <= 0) {
          console.warn(`Invalid duration for habit ${habit.name}:`, { target: seconds });
          return null;
        }

        return {
          id: `habit-${habit.id}`,
          name: habit.name,
          completed: false,
          duration: seconds, // Already in seconds, no conversion needed
          createdAt: new Date().toISOString(),
          tags: [{ name: 'Habit', color: 'blue' }],
        };
      }).filter(Boolean) as Task[];

      // Only update if the habit tasks have changed
      const existingHabitTaskIds = tasks
        .filter(task => task.id.startsWith('habit-'))
        .map(task => task.id);
      
      const newHabitTaskIds = habitTasks.map(task => task.id);
      
      // Check if habit tasks have changed
      const habitTasksChanged = 
        existingHabitTaskIds.length !== newHabitTaskIds.length ||
        !existingHabitTaskIds.every(id => newHabitTaskIds.includes(id));

      if (habitTasksChanged) {
        console.log('Updating tasks with converted habits:', [...nonHabitTasks, ...habitTasks]);
        onTasksUpdate([...nonHabitTasks, ...habitTasks]);
      }
    } else if (tasks.some(task => task.id.startsWith('habit-'))) {
      // If there are no timer habits but we have habit tasks, remove them
      const newTasks = tasks.filter(task => !task.id.startsWith('habit-'));
      onTasksUpdate(newTasks);
    }
  }, [todaysHabits, tasks, onTasksUpdate]);

  return null;
};

