
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
    // 1. Get only timer habits for today
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    console.log('Timer habits for today:', timerHabits);

    // 2. Get set of existing habit task IDs for efficient lookup
    const existingTaskIds = new Set(
      tasks
        .filter(task => task.id.startsWith('habit-'))
        .map(task => task.id)
    );
    console.log('Existing habit task IDs:', Array.from(existingTaskIds));

    // 3. Get set of active habit IDs
    const activeHabitIds = new Set(timerHabits.map(habit => `habit-${habit.id}`));
    console.log('Active habit IDs:', Array.from(activeHabitIds));

    // 4. Remove tasks for inactive habits
    tasks
      .filter(task => 
        task.id.startsWith('habit-') && !activeHabitIds.has(task.id)
      )
      .forEach(task => {
        console.log('Removing inactive habit task:', task.id);
        actions.deleteTask(task.id);
        
        if (task.relationships?.habitId) {
          actions.removeRelationship(task.id, task.relationships.habitId);
        }
      });

    // 5. Add tasks for new habits
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      
      if (!existingTaskIds.has(taskId)) {
        console.log('Adding new habit task:', taskId);
        const target = habit.metrics?.target || 600; // Default 10 minutes

        // Add task
        actions.addTask({
          name: habit.name,
          completed: false,
          duration: target,
          relationships: { habitId: habit.id }
        });

        // Add relationship
        actions.addRelationship({
          sourceId: taskId,
          sourceType: 'task',
          targetId: habit.id,
          targetType: 'habit',
          relationType: 'habit-task'
        });

        // Add tag
        addTagToEntity('Habit', taskId, 'task');
      }
    });
  }, [todaysHabits, tasks]);

  return null;
};
