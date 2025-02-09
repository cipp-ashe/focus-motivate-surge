
import { useEffect, useState } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    // Create a new array with only the habits from currently active templates
    const activeHabits = activeTemplates.reduce<HabitDetail[]>((acc, template) => {
      // Only include habits if the template is active for today
      if (template.activeDays.includes(dayOfWeek)) {
        // Map through habits to ensure we pass through all properties
        const templatesHabits = template.habits.map(habit => ({
          ...habit,
          // Ensure duration is properly passed through
          duration: habit.duration || null
        }));
        return [...acc, ...templatesHabits];
      }
      return acc;
    }, []);
    
    setTodaysHabits(activeHabits);
  }, [activeTemplates]); // This ensures we update whenever templates change

  return {
    todaysHabits,
  };
};
