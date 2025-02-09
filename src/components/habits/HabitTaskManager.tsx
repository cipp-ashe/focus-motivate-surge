
import { useEffect, useCallback, useMemo } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useTaskContext } from "@/contexts/TaskContext";
import type { ActiveTemplate } from "@/components/habits/types";
import { TASKS_UPDATED_EVENT } from "@/hooks/useTaskStorage";

interface HabitTaskManagerProps {
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity, getEntityTags } = useTagSystem();
  const { tasks, addTask } = useTaskContext();

  // Memoize non-habit tasks
  const nonHabitTasks = useMemo(() => {
    return tasks.filter(task => !getEntityTags(task.id, 'task').some(tag => tag.name === 'Habit'));
  }, [tasks, getEntityTags]);

  // Filter and create tasks only for timer-based habits
  const syncHabitTasks = useCallback(() => {
    console.log('Syncing habit tasks');
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      const existingTask = tasks.find(t => t.id === taskId);
      
      if (!existingTask) {
        const task = {
          id: taskId,
          name: habit.name,
          completed: false,
          duration: habit.metrics?.target ? Math.round(habit.metrics.target / 60) * 60 : undefined,
          relationships: {
            habitId: habit.id
          }
        };

        addTagToEntity('Habit', taskId, 'task');
        addTask(task);
      }
    });
  }, [todaysHabits, tasks, addTask, addTagToEntity]);

  useEffect(() => {
    syncHabitTasks();
    
    // Subscribe to task updates
    const handleTasksUpdate = () => {
      console.log('Tasks updated, syncing habits');
      syncHabitTasks();
    };

    window.addEventListener(TASKS_UPDATED_EVENT, handleTasksUpdate);
    
    return () => {
      window.removeEventListener(TASKS_UPDATED_EVENT, handleTasksUpdate);
    };
  }, [syncHabitTasks]);

  return null;
};
