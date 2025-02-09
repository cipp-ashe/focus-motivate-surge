
import { useEffect, useCallback, useMemo } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import type { Task } from "@/types/tasks";
import type { ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";

interface HabitTaskManagerProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ tasks, onTasksUpdate, activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity, getEntityTags } = useTagSystem();

  // Memoize non-habit tasks
  const nonHabitTasks = useMemo(() => {
    return tasks.filter(task => !getEntityTags(task.id, 'task').some(tag => tag.name === 'Habit'));
  }, [tasks, getEntityTags]);

  // Filter and create tasks only for timer-based habits
  const habitTasks = useMemo(() => {
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    
    return timerHabits.map(habit => {
      const taskId = `habit-${habit.id}`;
      const existingTask = tasks.find(t => t.id === taskId);
      
      const task: Task = {
        id: taskId,
        name: habit.name,
        completed: existingTask?.completed || false,
        duration: habit.metrics?.target ? Math.round(habit.metrics.target / 60) * 60 : undefined, // Convert to seconds
        createdAt: existingTask?.createdAt || new Date().toISOString(),
        relationships: {
          habitId: habit.id
        }
      };

      // Add the Habit tag
      addTagToEntity('Habit', taskId, 'task');

      return task;
    });
  }, [todaysHabits, tasks, addTagToEntity]);

  // Sync tasks whenever habits change
  useEffect(() => {
    const newTasks = [...nonHabitTasks, ...habitTasks];
    onTasksUpdate(newTasks);
  }, [nonHabitTasks, habitTasks, onTasksUpdate]);

  useEffect(() => {
    // Log initial sync for debugging
    console.log('Initial habit-task sync:', {
      todaysHabits,
      habitTasks,
      allTasks: [...nonHabitTasks, ...habitTasks]
    });
  }, []);

  return null;
};
