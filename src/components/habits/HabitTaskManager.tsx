
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useTaskState } from "@/contexts/tasks/TaskContext";
import type { ActiveTemplate } from '@/components/habits/types';
import { eventBus } from "@/lib/eventBus";

interface HabitTaskManagerProps {
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity } = useTagSystem();
  const { items: tasks } = useTaskState();
  
  // Use a ref to track initialization
  useEffect(() => {
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
    tasks
      .filter(task => 
        task.id.startsWith('habit-') && !activeHabitIds.has(task.id)
      )
      .forEach(task => {
        console.log('Removing task:', task.id);
        eventBus.emit('task:delete', task.id);
      });

    // Add new tasks (only once)
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      
      if (!existingTaskIds.has(taskId)) {
        console.log('Creating new task for habit:', habit.id);
        const target = habit.metrics?.target || 600; // 10 minutes default

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
  }, [todaysHabits, tasks]); // Only depend on todaysHabits and tasks

  return null;
};
