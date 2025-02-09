
import { useEffect, useState, useCallback } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);

  const getTodaysHabits = useCallback(() => {
    // Get today's day name (e.g., "Monday")
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    // Filter habits from templates that are active today
    const habitsForToday = activeTemplates.flatMap(template => {
      if (template.activeDays.includes(dayOfWeek)) {
        // Map habits and ensure proper duration handling for timer habits
        return template.habits.map(habit => {
          const duration = habit.metrics.type === 'timer' && habit.metrics.target 
            ? parseInt(String(habit.metrics.target)) 
            : undefined;
            
          return {
            ...habit,
            duration
          };
        });
      }
      return [];
    });

    return habitsForToday;
  }, [activeTemplates]);

  useEffect(() => {
    const habits = getTodaysHabits();
    console.log('Updating today\'s habits:', habits);
    setTodaysHabits(habits);
  }, [getTodaysHabits]);

  return { todaysHabits };
};
