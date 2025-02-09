
import { useEffect, useState, useCallback } from 'react';
import { useTagSystem } from '@/hooks/useTagSystem';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const { getEntityTags } = useTagSystem();

  const getTodaysHabits = useCallback(() => {
    // Get today's day name (e.g., "Monday")
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    // Filter habits from templates that are active today
    const habitsForToday = activeTemplates.flatMap(template => {
      if (template.activeDays.includes(dayOfWeek)) {
        // Only include habits that have the appropriate tags
        return template.habits.filter(habit => {
          const tags = getEntityTags(habit.id, 'habit');
          return tags.some(tag => {
            if (habit.metrics.type === 'timer') return tag.name === 'TimerHabit';
            if (habit.metrics.type === 'note') return tag.name === 'NoteHabit';
            return tag.name === 'StandardHabit';
          });
        });
      }
      return [];
    });

    return habitsForToday;
  }, [activeTemplates, getEntityTags]);

  useEffect(() => {
    const habits = getTodaysHabits();
    console.log('Updating today\'s habits:', habits);
    setTodaysHabits(habits);
  }, [getTodaysHabits]);

  return { todaysHabits };
};
