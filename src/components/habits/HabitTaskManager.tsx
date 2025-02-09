
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
    
    // Filter timer habits that aren't dismissed
    const timerHabits = todaysHabits.filter(habit => 
      habit.metrics?.type === 'timer' && !dismissedHabits.includes(habit.id)
    );
    
    // Create a map of existing habit task IDs
    const existingHabitTaskIds = new Set(
      tasks
        .filter(task => task.id.startsWith('habit-'))
        .map(task => task.id)
    );

    // Remove inactive habit tasks
    const activeHabitIds = new Set(timerHabits.map(habit => `habit-${habit.id}`));
    const tasksToRemove = tasks.filter(task => 
      task.id.startsWith('habit-') && !activeHabitIds.has(task.id)
    );

    tasksToRemove.forEach(task => {
      actions.deleteTask(task.id);
      if (task.relationships?.habitId) {
        actions.removeRelationship(task.id, task.relationships.habitId);
      }
    });

    // Add new timer habit tasks (only if they don't exist)
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      if (!existingHabitTaskIds.has(taskId)) {
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
  }, [todaysHabits]);

  return null;
};
