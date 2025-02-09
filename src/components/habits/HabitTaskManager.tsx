
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
    console.log('HabitTaskManager running with:', {
      currentTasks: tasks,
      todaysHabits,
      activeTemplates
    });

    // Get existing non-habit tasks
    const nonHabitTasks = tasks.filter(task => !task.id.startsWith('habit-'));
    
    // Convert timer habits to tasks
    const timerHabits = todaysHabits.filter(habit => 
      habit.metrics.type === 'timer' && habit.metrics.target
    );
    
    if (timerHabits.length > 0) {
      console.log('Processing timer habits:', timerHabits);
      
      const habitTasks: Task[] = timerHabits.map(habit => {
        if (!habit.metrics.target || habit.metrics.target <= 0) {
          console.warn(`Invalid duration for habit ${habit.name}:`, habit.metrics);
          return null;
        }

        const taskId = `habit-${habit.id}`;
        const existingTask = tasks.find(t => t.id === taskId);

        // Create new task or use existing task's completion status
        const newTask: Task = {
          id: taskId,
          name: habit.name,
          completed: existingTask?.completed || false,
          duration: habit.metrics.target, // Already in seconds
          createdAt: existingTask?.createdAt || new Date().toISOString(),
          tags: [{ name: 'Habit', color: 'blue' }],
        };

        console.log(`Created/Updated task for habit ${habit.name}:`, newTask);
        return newTask;
      }).filter(Boolean) as Task[];

      const newTasks = [...nonHabitTasks, ...habitTasks];
      console.log('Updating tasks:', newTasks);
      onTasksUpdate(newTasks);
    } else if (tasks.some(task => task.id.startsWith('habit-'))) {
      // If there are no timer habits but we have habit tasks, remove them
      console.log('Removing habit tasks as no timer habits exist');
      const newTasks = tasks.filter(task => !task.id.startsWith('habit-'));
      onTasksUpdate(newTasks);
    }
  }, [todaysHabits, tasks, onTasksUpdate]);

  return null;
};
