
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
    const dayIndex = today.getDay();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[dayIndex] as DayOfWeek;
    
    console.log(`useTodaysHabits - Today is ${dayOfWeek}, checking active templates:`, activeTemplates);
    
    const habits = activeTemplates.flatMap(template => {
      console.log(`Checking template ${template.templateId} - active days:`, template.activeDays);
      return template.activeDays.includes(dayOfWeek) ? template.habits : [];
    });
    
    console.log("useTodaysHabits - Today's habits:", habits);
    return habits;
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
