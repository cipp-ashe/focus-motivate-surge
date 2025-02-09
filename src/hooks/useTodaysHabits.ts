
import { useEffect, useState } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);

  useEffect(() => {
    // Get today's day name (e.g., "Monday")
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    console.log('Active Templates:', activeTemplates);
    
    // Filter habits from templates that are active today
    const habitsForToday = activeTemplates.flatMap(template => {
      console.log(`Template ${template.templateId} active days:`, template.activeDays);
      console.log(`Template ${template.templateId} habits:`, template.habits);
      
      if (template.activeDays.includes(dayOfWeek)) {
        return template.habits;
      }
      return [];
    });

    console.log('Habits for today:', habitsForToday);
    setTodaysHabits(habitsForToday);
  }, [activeTemplates]);

  return { todaysHabits };
};

