
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useAppState, useAppStateActions } from "@/contexts/AppStateContext";
import { toast } from "sonner";
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

  // Get today's date in YYYY-MM-DD format for dismissed storage
  const today = new Date().toISOString().split('T')[0];
  const DISMISSED_HABITS_KEY = `dismissed-habits-${today}`;

  // Load dismissed habits for today
  const getDismissedHabits = (): string[] => {
    const dismissed = localStorage.getItem(DISMISSED_HABITS_KEY);
    return dismissed ? JSON.parse(dismissed) : [];
  };

  // Save dismissed habit
  const saveDismissedHabit = (habitId: string) => {
    const dismissed = getDismissedHabits();
    localStorage.setItem(DISMISSED_HABITS_KEY, JSON.stringify([...dismissed, habitId]));
  };

  useEffect(() => {
    const dismissedHabits = getDismissedHabits();
    const timerHabits = todaysHabits.filter(habit => 
      habit.metrics?.type === 'timer' && !dismissedHabits.includes(habit.id)
    );
    const activeHabitIds = timerHabits.map(habit => `habit-${habit.id}`);
    
    // Only remove habit-related tasks
    const habitTasks = tasks.filter(task => task.id.startsWith('habit-'));
    const tasksToRemove = habitTasks.filter(task => !activeHabitIds.includes(task.id));
    
    // Remove only inactive habit tasks
    tasksToRemove.forEach(task => {
      actions.deleteTask(task.id);
      const habitId = task.relationships?.habitId;
      if (habitId) {
        actions.removeRelationship(task.id, habitId);
      }
    });

    // Add new timer habit tasks
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      if (!tasks.some(t => t.id === taskId)) {
        const target = habit.metrics?.target || 1500;
        
        actions.addTask({
          name: habit.name,
          completed: false,
          duration: target,
          relationships: { habitId: habit.id }
        });

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
  }, [todaysHabits, tasks]);

  return null;
};
