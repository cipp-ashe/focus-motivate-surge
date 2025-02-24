
import { useEffect, useState, useCallback } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);

  const getTodaysHabits = useCallback(() => {
    // Get today's day name (e.g., "Monday")
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    // Filter habits from templates that are active today
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

    // For each timer-based habit, generate a task
    habits.forEach(habit => {
      if (habit.metrics.type === 'timer') {
        const template = activeTemplates.find(t => 
          t.habits.some(h => h.id === habit.id)
        );
        
        if (template) {
          eventBus.emit('habit:generate-task', {
            habitId: habit.id,
            templateId: template.templateId,
            duration: habit.metrics.target || 25, // Default to 25 minutes if no target set
            name: `${habit.name} (${habit.metrics.target || 25}min)`
          });
        }
      }
    });

    setTodaysHabits(habits);
  }, [getTodaysHabits, activeTemplates]);

  return { todaysHabits };
};
