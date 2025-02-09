
import { useEffect, useCallback, useMemo, useRef } from "react";
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

  // Memoize non-habit tasks
  const nonHabitTasks = useMemo(() => {
    return tasks.filter(task => !task.tags?.some(tag => tag.name === 'Habit'));
  }, [tasks]);

  // Memoize habit tasks creation
  const habitTasks = useMemo(() => {
    console.log('Creating habit tasks from:', todaysHabits);
    return todaysHabits.map(habit => {
      const taskId = `habit-${habit.id}`;
      const existingTask = tasks.find(t => t.id === taskId);
      
      // Extract duration from metrics correctly
      let duration;
      if (habit.metrics?.type === 'timer' && typeof habit.metrics.target === 'number') {
        duration = habit.metrics.target;
      } else if (habit.metrics?.type === 'duration' && typeof habit.metrics.target === 'number') {
        duration = habit.metrics.target;
      }

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

  // Synchronize tasks whenever habits or non-habit tasks change
  useEffect(() => {
    const newTasks = [...nonHabitTasks, ...habitTasks];
    console.log('Synchronizing tasks:', { nonHabitTasks, habitTasks, newTasks });
    onTasksUpdate(newTasks);
  }, [nonHabitTasks, habitTasks, onTasksUpdate]);

  return null;
};
