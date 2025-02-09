
import { useEffect, useRef } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useAppState, useAppStateActions } from "@/contexts/AppStateContext";
import type { ActiveTemplate } from '@/components/habits/types';

interface HabitTaskManagerProps {
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity } = useTagSystem();
  const state = useAppState();
  const actions = useAppStateActions();
  const { tasks: { items: tasks } } = state;
  
  // Use a ref to track initialization
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      return;
    }

    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    console.log('Processing timer habits:', timerHabits.length);

    // Get existing task IDs for lookup
    const existingTaskIds = new Set(
      tasks
        .filter(task => task.id.startsWith('habit-'))
        .map(task => task.id)
    );

    // Create Set of active habit IDs
    const activeHabitIds = new Set(timerHabits.map(habit => `habit-${habit.id}`));

    // Remove inactive tasks
    const tasksToRemove = tasks.filter(task => 
      task.id.startsWith('habit-') && !activeHabitIds.has(task.id)
    );

    tasksToRemove.forEach(task => {
      console.log('Removing task:', task.id);
      actions.deleteTask(task.id);
      
      if (task.relationships?.habitId) {
        actions.removeRelationship(task.id, task.relationships.habitId);
      }
    });

    // Add new tasks (only once)
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      
      if (!existingTaskIds.has(taskId)) {
        console.log('Creating new task for habit:', habit.id);
        const target = habit.metrics?.target || 600; // 10 minutes default

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

    isInitialized.current = true;
  }, [todaysHabits]); // Only depend on todaysHabits

  return null;
};

