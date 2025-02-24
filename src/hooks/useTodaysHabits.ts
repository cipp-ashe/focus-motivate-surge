
import { useEffect, useState, useCallback } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const [processedHabits, setProcessedHabits] = useState<Set<string>>(new Set());

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

    habits.forEach(habit => {
      // Skip if we've already processed this habit today
      if (habit.metrics?.type === 'timer' && !processedHabits.has(habit.id)) {
        const template = activeTemplates.find(t => 
          t.habits.some(h => h.id === habit.id)
        );
        
        if (template) {
          // Store that we've processed this habit
          setProcessedHabits(prev => new Set(prev).add(habit.id));
          
          // Check if task already exists before creating
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
  }, [getTodaysHabits, activeTemplates, processedHabits]);

  // Reset processed habits at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      setProcessedHabits(new Set());
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  return { todaysHabits };
};
