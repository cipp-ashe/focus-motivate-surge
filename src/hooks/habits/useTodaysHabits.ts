
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
      const isActiveToday = template.activeDays.includes(dayOfWeek);
      console.log(`Template ${template.templateId} is active today: ${isActiveToday}`);
      
      return isActiveToday ? template.habits : [];
    });
    
    console.log("useTodaysHabits - Today's habits:", habits);
    console.log("useTodaysHabits - Number of habits found for today:", habits.length);
    return habits;
  }, [activeTemplates]);

  // Process today's habits and generate tasks for timer-based habits
  const processHabits = useCallback((habits: HabitDetail[]) => {
    const today = new Date().toDateString();
    console.log('Processing habits for today:', today);
    
    habits.forEach(habit => {
      if (habit.metrics?.type === 'timer') {
        const template = activeTemplates.find(t => 
          t.habits.some(h => h.id === habit.id)
        );
        
        if (template) {
          console.log(`Scheduling timer habit: ${habit.name} (${habit.id}) from template ${template.templateId}`);
          
          // Force emit the event to ensure task creation
          eventBus.emit('habit:schedule', {
            habitId: habit.id,
            templateId: template.templateId,
            duration: (habit.metrics.target || 25) * 60, // Convert minutes to seconds
            name: habit.name,
            date: today
          });
        }
      }
    });
    
    localStorage.setItem('lastHabitProcessingDate', today);
  }, [activeTemplates]);

  useEffect(() => {
    const habits = getTodaysHabits();
    setTodaysHabits(habits);
    
    // Force process habits on first load and every time templates change
    processHabits(habits);
    
  }, [getTodaysHabits, processHabits]);

  return { todaysHabits };
};
