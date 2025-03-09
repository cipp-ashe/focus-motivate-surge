
import { useCallback, useEffect, useState } from 'react';
import { Habit } from '@/types/habits';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { timeUtils } from '@/utils/timeUtils';
import { eventBus } from '@/lib/eventBus';
import { useLocation } from 'react-router-dom';

/**
 * Hook to get today's habits based on active templates
 */
export const useTodaysHabits = () => {
  const { state } = useHabitContext();
  const { activeTemplates } = state;
  const [todaysHabits, setTodaysHabits] = useState<Habit[]>([]);
  const location = useLocation();

  // Function to process habits - defined before use
  const processHabits = useCallback(() => {
    // No active templates, return empty array
    if (!activeTemplates || activeTemplates.length === 0) {
      console.log("useTodaysHabits - No active templates, returning empty habits list");
      setTodaysHabits([]);
      return;
    }

    const today = timeUtils.getCurrentDayName();
    console.log(`useTodaysHabits - Today is ${today}, checking active templates:`, activeTemplates);

    // Collect habits from active templates that are scheduled for today
    const habits: Habit[] = [];
    
    activeTemplates.forEach(template => {
      // Check if template is active today
      const isActiveToday = template.activeDays?.includes(today);
      
      console.log(`Checking template ${template.id} - active days:`, template.activeDays);
      console.log(`Template ${template.id} is active today:`, isActiveToday);
      
      if (isActiveToday) {
        // Add all habits from this template
        if (template.habits && template.habits.length > 0) {
          template.habits.forEach(habit => {
            habits.push({
              ...habit,
              templateId: template.id
            });
          });
        }
      }
    });
    
    console.log(`useTodaysHabits - Today's habits:`, habits);
    console.log(`useTodaysHabits - Number of habits found for today:`, habits.length);
    setTodaysHabits(habits);
    
    // Schedule tasks for timer habits
    if (habits.length > 0) {
      const formattedDate = timeUtils.getCurrentDateString();
      console.log(`Processing habits for today: ${formattedDate}`);
      
      habits.forEach(habit => {
        // Only process timer type habits
        if (habit.type === 'timer' && habit.duration) {
          console.log(`Scheduling timer habit: ${habit.name} (${habit.id}) from template ${habit.templateId}`);
          console.log(`Creating task for habit ${habit.name} with duration ${habit.duration} seconds (${habit.duration / 60} minutes)`);
          
          // Schedule task creation via event bus
          eventBus.emit('habit:schedule', {
            habitId: habit.id,
            templateId: habit.templateId,
            name: habit.name,
            duration: habit.duration,
            date: formattedDate
          });
        }
      });
    }
  }, [activeTemplates]);

  // Process habits when activeTemplates change or on location change
  useEffect(() => {
    processHabits();
  }, [processHabits, activeTemplates]);
  
  // Also reprocess when location changes (navigating between pages)
  useEffect(() => {
    console.log(`useTodaysHabits - Location changed to ${location.pathname}, reprocessing habits`);
    processHabits();
    
    // Also listen for specific habit events
    const unsubscribeProcessed = eventBus.on('habits:processed', () => {
      console.log('useTodaysHabits - Received habits:processed event, updating habits');
      processHabits();
    });
    
    return () => {
      unsubscribeProcessed();
    };
  }, [location, processHabits]);

  return { 
    todaysHabits, 
    refreshHabits: processHabits 
  };
};
