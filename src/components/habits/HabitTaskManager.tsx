
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useTaskContext } from "@/contexts/TaskContext";
import type { ActiveTemplate } from '@/components/habits/types';
import { eventBus } from "@/lib/eventBus";

interface HabitTaskManagerProps {
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity } = useTagSystem();
  const { items: tasks, cleared } = useTaskContext();
  
  useEffect(() => {
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    console.log('Processing timer habits:', timerHabits.length);

    // Get existing task IDs for lookup
    const existingTaskIds = new Set(
      tasks
        .filter(task => task.relationships?.habitId)
        .map(task => task.relationships.habitId)
    );

    // Get IDs of manually cleared habit tasks for today
    const clearedHabitIds = new Set(
      cleared
        .filter(task => 
          task.relationships?.habitId && 
          task.clearReason === 'manual'
        )
        .map(task => task.relationships.habitId)
    );

    // Create Set of active habit IDs
    const activeHabitIds = new Set(timerHabits.map(habit => habit.id));

    // Remove tasks for habits that are no longer active
    tasks
      .filter(task => 
        task.relationships?.habitId && 
        !activeHabitIds.has(task.relationships.habitId)
      )
      .forEach(task => {
        console.log('Removing inactive habit task:', task.id);
        eventBus.emit('task:delete', { taskId: task.id, reason: 'habit-removed' });
      });

    // Add new tasks for habits that don't have one yet and weren't manually cleared
    timerHabits.forEach(habit => {
      if (!existingTaskIds.has(habit.id) && !clearedHabitIds.has(habit.id)) {
        console.log('Creating new task for habit:', habit.id);
        const target = habit.metrics?.target || 600;

        const taskId = `habit-${habit.id}`;
        eventBus.emit('task:create', {
          id: taskId,
          name: habit.name,
          completed: false,
          duration: target,
          createdAt: new Date().toISOString(),
          relationships: { habitId: habit.id }
        });

        addTagToEntity('Habit', taskId, 'task');
      }
    });
  }, [todaysHabits, tasks, cleared]);

  return null;
};
