
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
          // Add appropriate tag based on habit type if not already present
          const tags = getEntityTags(habit.id, 'habit');
          if (!tags.length) {
            if (habit.metrics.type === 'timer') {
              addTagToEntity('TimerHabit', habit.id, 'habit');
            } else if (habit.metrics.type === 'note') {
              addTagToEntity('NoteHabit', habit.id, 'habit');
            } else {
              addTagToEntity('StandardHabit', habit.id, 'habit');
            }
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
