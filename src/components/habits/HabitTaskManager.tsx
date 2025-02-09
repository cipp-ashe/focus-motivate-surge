
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

  // Run only when habits or templates change, not on every task change
  useEffect(() => {
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    const activeHabitIds = timerHabits.map(habit => `habit-${habit.id}`);
    
    // Only remove stale timer habit tasks
    tasks
      .filter(task => task.id.startsWith('habit-'))
      .forEach(task => {
        if (!activeHabitIds.includes(task.id)) {
          actions.deleteTask(task.id);
        }
      });

    // Only add new timer habit tasks
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      if (!tasks.some(t => t.id === taskId)) {
        actions.addTask({
          id: taskId,
          name: habit.name,
          completed: false,
          duration: habit.metrics?.target ? Math.round(habit.metrics.target / 60) * 60 : undefined,
          relationships: { habitId: habit.id }
        });
        addTagToEntity('Habit', taskId, 'task');
      }
    });
  }, [todaysHabits, activeTemplates]); // Only depend on habits and templates, not tasks

  return null;
};
