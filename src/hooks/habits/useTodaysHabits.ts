
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
  const [lastProcessedDate, setLastProcessedDate] = useState<string>('');

  // Function to process habits - defined before use
  const processHabits = useCallback(() => {
    // No active templates, return empty array
    if (!activeTemplates || activeTemplates.length === 0) {
      console.log("useTodaysHabits - No active templates, returning empty habits list");
      setTodaysHabits([]);
      return;
    }

    const today = timeUtils.getCurrentDayName();
    const currentDate = timeUtils.getCurrentDateString();
    
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
    
    // Schedule tasks for timer habits - but only if date changed or first run
    if (habits.length > 0 && (currentDate !== lastProcessedDate)) {
      console.log(`Processing habits for today: ${currentDate} (last processed: ${lastProcessedDate || 'never'})`);
      setLastProcessedDate(currentDate);
      
      // Schedule timer tasks with a slight delay to ensure all context is ready
      setTimeout(() => {
        scheduleHabitTasks(habits, currentDate);
      }, 300);
    }
  }, [activeTemplates, lastProcessedDate]);

  // Helper function to schedule habit tasks
  const scheduleHabitTasks = (habits: HabitDetail[], formattedDate: string) => {
    // Count how many timer habits we'll be scheduling
    const timerHabits = habits.filter(habit => 
      habit.metrics?.type === 'timer' && habit.metrics?.target
    );
    
    console.log(`Scheduling ${timerHabits.length} timer habits for ${formattedDate}`);
    
    // Schedule each timer habit as a task
    timerHabits.forEach(habit => {
      console.log(`Scheduling timer habit: ${habit.name} (${habit.id}) from template ${habit.relationships?.templateId}`);
      console.log(`Creating task for habit ${habit.name} with duration ${habit.metrics?.target} seconds (${(habit.metrics?.target || 0) / 60} minutes)`);
      
      // Schedule task creation via event bus with clear data
      eventBus.emit('habit:schedule', {
        habitId: habit.id,
        templateId: habit.relationships?.templateId,
        name: habit.name,
        duration: habit.metrics?.target || 1500, // Default to 25 minutes if no target is set
        date: formattedDate
      });
    });
    
    // Force task update after scheduling all habits
    if (timerHabits.length > 0) {
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 500);
    }
  };

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
    
    // Force habit processing on mount
    const timeout = setTimeout(() => {
      const currentDate = timeUtils.getCurrentDateString();
      if (todaysHabits.length > 0 && lastProcessedDate !== currentDate) {
        console.log('Force scheduling habit tasks after initial load');
        scheduleHabitTasks(todaysHabits, currentDate);
        setLastProcessedDate(currentDate);
      }
    }, 1000);
    
    return () => {
      unsubscribeProcessed();
      clearTimeout(timeout);
    };
  }, [location, processHabits, todaysHabits, lastProcessedDate]);

  return { 
    todaysHabits, 
    refreshHabits: processHabits 
  };
};
