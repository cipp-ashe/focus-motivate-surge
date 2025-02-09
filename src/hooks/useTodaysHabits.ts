
import { useEffect, useState, useCallback } from 'react';
import { useTagSystem } from '@/hooks/useTagSystem';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const { getEntityTags, addTagToEntity } = useTagSystem();

  const getTodaysHabits = useCallback(() => {
    // Get today's day name (e.g., "Monday")
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    // Filter habits from templates that are active today
    const habitsForToday = activeTemplates.flatMap(template => {
      if (template.activeDays.includes(dayOfWeek)) {
        return template.habits.map(habit => {
          const taskId = `habit-${habit.id}`;
          // Add tags only if they don't exist
          const existingTags = getEntityTags(taskId, 'task');
          if (!existingTags.some(tag => tag.name === 'Habit')) {
            addTagToEntity('Habit', taskId, 'task');
          }
          if (habit.metrics.type === 'timer' && !existingTags.some(tag => tag.name === 'TimerHabit')) {
            addTagToEntity('TimerHabit', taskId, 'task');
          }
          return habit;
        });
      }
      return [];
    });

    return habitsForToday;
  }, [activeTemplates, getEntityTags, addTagToEntity]);

  useEffect(() => {
    const habits = getTodaysHabits();
    console.log('Updating today\'s habits:', habits);
    setTodaysHabits(habits);
  }, [getTodaysHabits]);

  return { todaysHabits };
};
