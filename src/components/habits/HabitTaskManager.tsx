
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useAppState, useAppStateActions } from "@/contexts/AppStateContext";
import type { ActiveTemplate } from "@/components/habits/types";

interface HabitTaskManagerProps {
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity } = useTagSystem();
  const state = useAppState();
  const actions = useAppStateActions();
  const { tasks: { items: tasks } } = state;

  useEffect(() => {
    // Only run for timer habits
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    const activeHabitIds = timerHabits.map(habit => `habit-${habit.id}`);
    
    // Remove stale tasks first
    tasks.forEach(task => {
      if (task.id.startsWith('habit-') && !activeHabitIds.includes(task.id)) {
        actions.deleteTask(task.id);
      }
    });

    // Add missing tasks
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

        actions.addTask(task);
        addTagToEntity('Habit', taskId, 'task');
      }
    });
  }, [todaysHabits, tasks, actions, addTagToEntity]);

  return null;
};

