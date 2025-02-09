
import { useEffect, useState } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';

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

  return {
    todaysHabits,
  };
};
