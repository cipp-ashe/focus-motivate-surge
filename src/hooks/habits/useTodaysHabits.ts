
import { useState, useEffect } from 'react';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { DayOfWeek } from '@/components/habits/types';

export const useTodaysHabits = () => {
  const { templates } = useHabitContext();
  const [todaysHabits, setTodaysHabits] = useState<any[]>([]);

  useEffect(() => {
    // Get today's day of week
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    
    // Filter templates active today
    const activeTemplates = templates.filter(template => 
      template.activeDays && template.activeDays.includes(today)
    );
    
    // Flatten habits from all active templates
    const allHabits = activeTemplates.flatMap(template => 
      (template.habits || []).map(habit => ({
        ...habit,
        templateId: template.templateId,
        templateName: template.name
      }))
    );
    
    setTodaysHabits(allHabits);
  }, [templates]);

  return { todaysHabits };
};
