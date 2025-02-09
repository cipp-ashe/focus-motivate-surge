
import { useEffect, useCallback, useRef } from "react";
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
  const syncInProgress = useRef(false);

  // Cleanup stale habit tasks when templates change
  useEffect(() => {
    if (syncInProgress.current) return;

    const habitTasks = tasks.filter(task => task.id.startsWith('habit-'));
    const activeHabitIds = todaysHabits.map(habit => `habit-${habit.id}`);
    
    // Remove tasks for habits that are no longer active
    habitTasks.forEach(task => {
      if (!activeHabitIds.includes(task.id)) {
        console.log('Removing stale habit task:', task.id);
        actions.deleteTask(task.id);
      }
    });
  }, [todaysHabits, tasks, actions]);

  // Sync habit tasks with memoized callback
  const syncHabitTasks = useCallback(() => {
    if (syncInProgress.current) return;

    syncInProgress.current = true;
    console.log('Syncing habit tasks');
    
    try {
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

          actions.addTask(task);
          addTagToEntity('Habit', taskId, 'task');
        }
      });
    } finally {
      syncInProgress.current = false;
    }
  }, [todaysHabits, tasks, actions, addTagToEntity]);

  // Only run sync when dependencies change
  useEffect(() => {
    syncHabitTasks();
  }, [syncHabitTasks]);

  return null;
};
