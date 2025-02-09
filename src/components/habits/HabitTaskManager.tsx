
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
        const minutes = habit.metrics.target;
        
        console.log(`Converting habit duration for ${habit.name}:`, {
          target: minutes,
        });

        if (!minutes || minutes <= 0) {
          console.warn(`Invalid duration for habit ${habit.name}:`, { target: minutes });
          return null;
        }

        return {
          id: `habit-${habit.id}`,
          name: habit.name,
          completed: false,
          duration: minutes,
          createdAt: new Date().toISOString(),
          tags: [{ name: 'Habit', color: 'blue' }],
        };
      }).filter(Boolean) as Task[];

      const newTasks = [...nonHabitTasks, ...habitTasks];
      const currentTasksStr = JSON.stringify(tasks);
      const newTasksStr = JSON.stringify(newTasks);
      
      if (currentTasksStr !== newTasksStr) {
        console.log('Updating tasks with converted habits:', newTasks);
        onTasksUpdate(newTasks);
      }
    } else {
      if (tasks.some(task => task.id.startsWith('habit-'))) {
        const newTasks = tasks.filter(task => !task.id.startsWith('habit-'));
        onTasksUpdate(newTasks);
      }
    }
  }, [todaysHabits, tasks, onTasksUpdate]);

  return null;
};

