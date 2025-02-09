
import { useEffect, useState, useCallback } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { Task } from '@/components/tasks/TaskList';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    const activeHabits = activeTemplates.reduce<HabitDetail[]>((acc, template) => {
      if (template.activeDays.includes(dayOfWeek)) {
        return [...acc, ...template.habits];
      }
      return acc;
    }, []);
    
    setTodaysHabits(activeHabits);
  }, [activeTemplates]);

  const convertHabitToTask = useCallback((habit: HabitDetail): Task => {
    return {
      id: `habit-task-${habit.id}`,
      name: habit.name,
      completed: false,
      duration: habit.duration || 25,
    };
  }, []);

  return {
    todaysHabits,
    convertHabitToTask,
  };
};
