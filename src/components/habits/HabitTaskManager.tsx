
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
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    const activeHabitIds = timerHabits.map(habit => `habit-${habit.id}`);
    
    // Clean up stale tasks and relationships
    tasks
      .filter(task => task.id.startsWith('habit-'))
      .forEach(task => {
        if (!activeHabitIds.includes(task.id)) {
          // Remove both task and its relationships
          actions.deleteTask(task.id);
          const habitId = task.relationships?.habitId;
          if (habitId) {
            actions.removeRelationship(task.id, habitId);
          }
        }
      });

    // Add new timer habit tasks with proper relationships
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      if (!tasks.some(t => t.id === taskId)) {
        // Add task
        actions.addTask({
          name: habit.name,
          completed: false,
          duration: habit.metrics?.target ? Math.round(habit.metrics.target / 60) * 60 : undefined,
          relationships: { habitId: habit.id }
        });

        // Add relationship and tag
        actions.addRelationship({
          sourceId: taskId,
          sourceType: 'task',
          targetId: habit.id,
          targetType: 'habit',
          relationType: 'habit-task'
        });
        addTagToEntity('Habit', taskId, 'task');
      }
    });
  }, [todaysHabits, activeTemplates]); // Only depend on habits and templates

  return null;
};
