
import { useCallback, useEffect, useState } from 'react';
import { HabitDetail, DayOfWeek } from '@/components/habits/types';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { eventBus } from '@/lib/eventBus';
import { useLocation } from 'react-router-dom';

// Add timeUtils helper functions
const timeUtils = {
  getCurrentDayName: (): DayOfWeek => {
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
  },
  getCurrentDateString: (): string => {
    return new Date().toDateString();
  }
};

/**
 * Hook to get today's habits based on active templates
 */
export const useTodaysHabits = () => {
  const { templates: activeTemplates } = useHabitState();
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
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
    const habits: HabitDetail[] = [];
    
    activeTemplates.forEach(template => {
      // Check if template is active today
      const isActiveToday = template.activeDays?.includes(today);
      
      console.log(`Checking template ${template.templateId} - active days:`, template.activeDays);
      console.log(`Template ${template.templateId} is active today:`, isActiveToday);
      
      if (isActiveToday) {
        // Add all habits from this template
        if (template.habits && template.habits.length > 0) {
          template.habits.forEach(habit => {
            // Create a new habit object with the templateId in the relationships field
            const newHabit: HabitDetail = {
              ...habit,
              relationships: {
                ...habit.relationships,
                templateId: template.templateId
              }
            };
            habits.push(newHabit);
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
        if (habit.metrics?.type === 'timer' && habit.metrics?.target) {
          console.log(`Scheduling timer habit: ${habit.name} (${habit.id}) from template ${habit.relationships?.templateId}`);
          console.log(`Creating task for habit ${habit.name} with duration ${habit.metrics.target} seconds (${habit.metrics.target / 60} minutes)`);
          
          // Schedule task creation via event bus with clear data
          eventBus.emit('habit:schedule', {
            habitId: habit.id,
            templateId: habit.relationships?.templateId,
            name: habit.name,
            duration: habit.metrics.target,
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
