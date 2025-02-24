
import { useEffect, useState, useCallback } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

/**
 * Custom hook to manage today's habits and their task generation
 * Following Single Responsibility Principle - this hook only manages habit scheduling
 */
export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  
  // Get habits scheduled for today
  const getTodaysHabits = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
    
    return activeTemplates.flatMap(template => 
      template.activeDays.includes(dayOfWeek) ? template.habits : []
    );
  }, [activeTemplates]);

  useEffect(() => {
    const habits = getTodaysHabits();
    
    // Only emit events for new habits
    const lastProcessedDate = localStorage.getItem('lastHabitProcessingDate');
    const today = new Date().toDateString();
    
    // Process habits only once per day
    if (lastProcessedDate !== today) {
      console.log('Processing habits for new day:', today);
      
      habits.forEach(habit => {
        if (habit.metrics?.type === 'timer') {
          const template = activeTemplates.find(t => 
            t.habits.some(h => h.id === habit.id)
          );
          
          if (template) {
            // Emit a single event for habit task generation
            eventBus.emit('habit:schedule', {
              habitId: habit.id,
              templateId: template.templateId,
              duration: habit.metrics.target || 25,
              name: habit.name,
              date: today
            });
          }
        }
      });
      
      localStorage.setItem('lastHabitProcessingDate', today);
    }

    setTodaysHabits(habits);
  }, [getTodaysHabits, activeTemplates]);

  return { todaysHabits };
};
