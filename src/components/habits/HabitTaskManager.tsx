
import { useEffect, useCallback, useMemo } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useTaskContext } from "@/contexts/TaskContext";
import type { ActiveTemplate } from "@/components/habits/types";

interface HabitTaskManagerProps {
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity, getEntityTags } = useTagSystem();
  const { tasks, addTask } = useTaskContext();

  // Memoize non-habit tasks
  const nonHabitTasks = useMemo(() => {
    return tasks.filter(task => !getEntityTags(task.id, 'task').some(tag => tag.name === 'Habit'));
  }, [tasks, getEntityTags]);

  // Filter and create tasks only for timer-based habits
  const habitTasks = useMemo(() => {
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    
    return timerHabits.map(habit => {
      const taskId = `habit-${habit.id}`;
      const existingTask = tasks.find(t => t.id === taskId);
      
      if (!existingTask) {
        // Only create task if it doesn't exist
        const task = {
          id: taskId,
          name: habit.name,
          completed: false,
          duration: habit.metrics?.target ? Math.round(habit.metrics.target / 60) * 60 : undefined,
          relationships: {
            habitId: habit.id
          }
        };

        // Add the Habit tag
        addTagToEntity('Habit', taskId, 'task');
        
        // Add the task through the context
        addTask(task);
      }
      
      return existingTask;
    }).filter(Boolean);
  }, [todaysHabits, tasks, addTask, addTagToEntity]);

  useEffect(() => {
    // Log initial sync for debugging
    console.log('Initial habit-task sync:', {
      todaysHabits,
      habitTasks,
      allTasks: [...nonHabitTasks, ...habitTasks]
    });
  }, []);

  return null;
};
