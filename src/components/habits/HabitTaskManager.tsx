
import { useEffect, useCallback, useMemo } from "react";
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

  // Memoize non-habit tasks to prevent unnecessary recalculations
  const nonHabitTasks = useMemo(() => {
    return tasks.filter(task => !task.tags?.some(tag => tag.name === 'Habit'));
  }, [tasks]);

  // Memoize habit task creation
  const habitTasks = useMemo(() => {
    return todaysHabits.map(habit => {
      const taskId = `habit-${habit.id}`;
      const existingTask = tasks.find(t => t.id === taskId);

      const duration = habit.metrics.type === 'timer' && habit.metrics.target 
        ? habit.metrics.target 
        : undefined;

      return {
        id: taskId,
        name: habit.name,
        completed: existingTask?.completed || false,
        duration,
        createdAt: existingTask?.createdAt || new Date().toISOString(),
        tags: [
          { name: 'Habit', color: 'blue' as const },
          ...(existingTask?.tags?.filter(tag => tag.name !== 'Habit') || [])
        ],
      };
    });
  }, [todaysHabits, tasks]);

  // Memoize tasks comparison
  const shouldUpdate = useMemo(() => {
    const newTasks = [...nonHabitTasks, ...habitTasks];
    return JSON.stringify(tasks) !== JSON.stringify(newTasks);
  }, [tasks, nonHabitTasks, habitTasks]);

  // Use useCallback for the update function
  const updateTasks = useCallback(() => {
    const newTasks = [...nonHabitTasks, ...habitTasks];
    onTasksUpdate(newTasks);
    toast.success("Habit tasks synchronized");
  }, [nonHabitTasks, habitTasks, onTasksUpdate]);

  useEffect(() => {
    if (shouldUpdate) {
      updateTasks();
    }
  }, [shouldUpdate, updateTasks]);

  return null;
};
