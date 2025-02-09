
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

  // Memoize habit tasks creation and tag management
  const habitTasks = useMemo(() => {
    console.log('Creating habit tasks from:', todaysHabits);
    return todaysHabits.map(habit => {
      const taskId = `habit-${habit.id}`;
      const existingTask = tasks.find(t => t.id === taskId);
      
      // Handle task duration based on habit type
      let duration;
      if (habit.metrics?.type === 'timer' && typeof habit.metrics.target === 'number') {
        duration = habit.metrics.target;
      }

      const task = {
        id: taskId,
        name: habit.name,
        completed: existingTask?.completed || false,
        duration,
        createdAt: existingTask?.createdAt || new Date().toISOString(),
      };

      // Add appropriate tags for habit tasks
      addTagToEntity('Habit', taskId, 'task');
      if (habit.metrics?.type === 'timer') {
        addTagToEntity('TimerHabit', taskId, 'task');
      } else if (habit.metrics?.type === 'note') {
        addTagToEntity('NoteHabit', taskId, 'task');
      }

      return task;
    });
  }, [todaysHabits, tasks, addTagToEntity]);

  // Initialize tasks on first render if there are habits but no tasks
  useEffect(() => {
    if (todaysHabits.length > 0 && tasks.length === 0) {
      console.log('Initializing tasks from habits:', todaysHabits);
      onTasksUpdate([...habitTasks]);
    }
  }, [todaysHabits, tasks.length, habitTasks, onTasksUpdate]);

  // Synchronize tasks whenever habits or non-habit tasks change
  useEffect(() => {
    const newTasks = [...nonHabitTasks, ...habitTasks];
    console.log('Synchronizing tasks:', { nonHabitTasks, habitTasks, newTasks });
    onTasksUpdate(newTasks);
  }, [nonHabitTasks, habitTasks, onTasksUpdate]);

  return null;
};
