/**
 * Hook for retrieving today's habits
 */

import { useState, useCallback, useEffect } from 'react';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { HabitDetail, DayOfWeek } from '@/types/habit';

export const useTodaysHabits = () => {
  const { templates } = useHabitContext();
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);

  // Get today's day of week
  const getTodayName = useCallback((): DayOfWeek => {
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
  }, []);

  // Refresh habits for today
  const refreshHabits = useCallback(() => {
    const today = getTodayName();
    console.log(`Refreshing habits for ${today}`);

    // Collect habits from all templates that are active today
    const habitsForToday: HabitDetail[] = [];

    templates.forEach((template) => {
      // Check if this template is active today
      if (template.activeDays.includes(today)) {
        // Add all habits from this template
        template.habits.forEach((habit) => {
          // Add template relationship to each habit
          const habitWithTemplate: HabitDetail = {
            ...habit,
            relationships: {
              ...habit.relationships,
              templateId: template.templateId,
            },
          };
          habitsForToday.push(habitWithTemplate);
        });
      }
    });

    // Sort habits by order if available
    const sortedHabits = [...habitsForToday].sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB;
    });

    setTodaysHabits(sortedHabits);
    return sortedHabits;
  }, [templates, getTodayName]);

  // Refresh habits when templates change
  useEffect(() => {
    refreshHabits();
  }, [templates, refreshHabits]);

  return {
    todaysHabits,
    refreshHabits,
  };
};
