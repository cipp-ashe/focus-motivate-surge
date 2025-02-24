
import { useEffect, useState, useCallback } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);

  const getTodaysHabits = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    const habitsForToday = activeTemplates.flatMap(template => {
      if (template.activeDays.includes(dayOfWeek)) {
        return template.habits;
      }
      return [];
    });

    return habitsForToday;
  }, [activeTemplates]);

  useEffect(() => {
    const habits = getTodaysHabits();
    console.log('Updating today\'s habits:', {
      habits,
      timerHabits: habits.filter(h => h.metrics?.type === 'timer'),
      date: new Date().toLocaleString(),
      activeTemplates
    });

    // Track which habits we've already processed to prevent duplicates
    const processedHabits = new Set<string>();
    
    habits.forEach(habit => {
      // Skip if we've already processed this habit
      if (habit.metrics.type === 'timer' && !processedHabits.has(habit.id)) {
        processedHabits.add(habit.id);
        
        const template = activeTemplates.find(t => 
          t.habits.some(h => h.id === habit.id)
        );
        
        if (template) {
          eventBus.emit('habit:generate-task', {
            habitId: habit.id,
            templateId: template.templateId,
            duration: habit.metrics.target || 25,
            name: habit.name
          });
        }
      }
    });

    setTodaysHabits(habits);
  }, [getTodaysHabits, activeTemplates]);

  return { todaysHabits };
};
