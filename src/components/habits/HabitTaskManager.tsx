
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import type { Task } from "@/components/tasks/TaskList";
import type { ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";
import { Tag } from "@/types/notes";

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

    // Get existing tasks that weren't created from habits
    const nonHabitTasks = tasks.filter(task => !task.tags?.some(tag => tag.name === 'Habit'));
    
    // Convert habits to tasks format
    const habitTasks = todaysHabits.map(habit => {
      const taskId = `habit-${habit.id}`;
      const existingTask = tasks.find(t => t.id === taskId);

      // Base task structure that matches regular tasks
      const newTask: Task = {
        id: taskId,
        name: habit.name,
        completed: existingTask?.completed || false,
        duration: habit.metrics.type === 'timer' ? habit.metrics.target : undefined,
        createdAt: existingTask?.createdAt || new Date().toISOString(),
        tags: [
          { name: 'Habit', color: 'blue' as const }
        ],
      };

      // If task exists, preserve any custom tags that aren't the Habit tag
      if (existingTask?.tags) {
        const customTags = existingTask.tags.filter(tag => tag.name !== 'Habit');
        newTask.tags = [...newTask.tags, ...customTags];
      }

      console.log(`Created/Updated task for habit ${habit.name}:`, newTask);
      return newTask;
    });

    // Combine non-habit tasks with habit tasks
    const newTasks = [...nonHabitTasks, ...habitTasks];
    console.log('Updating tasks:', newTasks);
    
    // Only update if there are actual changes
    const tasksChanged = JSON.stringify(tasks) !== JSON.stringify(newTasks);
    if (tasksChanged) {
      onTasksUpdate(newTasks);
      toast.success("Habit tasks synchronized");
    }
  }, [todaysHabits, tasks, onTasksUpdate]);

  return null;
};

