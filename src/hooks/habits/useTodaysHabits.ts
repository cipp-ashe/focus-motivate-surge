
import { useCallback, useEffect, useState, useRef } from 'react';
import { HabitDetail, DayOfWeek } from '@/components/habits/types';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { eventBus } from '@/lib/eventBus';
import { useLocation } from 'react-router-dom';

// Time utility functions
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
  const processingRef = useRef(false);
  const initialProcessDoneRef = useRef(false);

  // Function to process habits - defined before use
  const processHabits = useCallback(() => {
    // Prevent concurrent processing
    if (processingRef.current) {
      console.log("useTodaysHabits - Already processing habits, skipping");
      return;
    }

    processingRef.current = true;
    
    try {
      // No active templates, return empty array
      if (!activeTemplates || activeTemplates.length === 0) {
        console.log("useTodaysHabits - No active templates, returning empty habits list");
        setTodaysHabits([]);
        return;
      }

      const today = timeUtils.getCurrentDayName();
      const currentDate = timeUtils.getCurrentDateString();
      
      console.log(`useTodaysHabits - Today is ${today}, checking ${activeTemplates.length} active templates`);

      // Collect habits from active templates that are scheduled for today
      const habits: HabitDetail[] = [];
      
      activeTemplates.forEach(template => {
        // Check if template is active today
        const isActiveToday = template.activeDays?.includes(today);
        
        if (isActiveToday) {
          // Add all habits from this template
          if (template.habits && template.habits.length > 0) {
            template.habits.forEach(habit => {
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
      
      console.log(`useTodaysHabits - Found ${habits.length} habits for today`);
      setTodaysHabits(habits);
      
      // Schedule tasks for timer habits - but only if date changed or first run
      if (habits.length > 0 && (currentDate !== lastProcessedDate || !initialProcessDoneRef.current)) {
        console.log(`Processing habits for today: ${currentDate} (last processed: ${lastProcessedDate || 'never'})`);
        setLastProcessedDate(currentDate);
        initialProcessDoneRef.current = true;
        
        // Schedule timer tasks with a slight delay
        setTimeout(() => {
          scheduleHabitTasks(habits, currentDate);
        }, 300);
      }
    } finally {
      // Release processing lock
      setTimeout(() => {
        processingRef.current = false;
      }, 200);
    }
  }, [activeTemplates, lastProcessedDate]);

  // Helper function to schedule habit tasks
  const scheduleHabitTasks = (habits: HabitDetail[], formattedDate: string) => {
    // Count how many timer habits we'll be scheduling
    const timerHabits = habits.filter(habit => 
      habit.metrics?.type === 'timer' && habit.metrics?.target
    );
    
    console.log(`Scheduling ${timerHabits.length} timer habits for ${formattedDate}`);
    
    if (timerHabits.length === 0) return;
    
    // Schedule each timer habit as a task, with a small delay between each
    timerHabits.forEach((habit, index) => {
      setTimeout(() => {
        console.log(`Creating task for habit ${habit.name} (${habit.id}) with duration ${habit.metrics?.target} seconds`);
        
        // Schedule task creation via event bus with clear data
        eventBus.emit('habit:schedule', {
          habitId: habit.id,
          templateId: habit.relationships?.templateId,
          name: habit.name,
          duration: habit.metrics?.target || 1500, // Default to 25 minutes if no target is set
          date: formattedDate
        });
      }, index * 50); // Stagger the task creation slightly
    });
    
    // Force task update after scheduling all habits
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, timerHabits.length * 50 + 300);
  };

  // Process habits when activeTemplates change
  useEffect(() => {
    processHabits();
  }, [processHabits, activeTemplates]);
  
  // Also reprocess when location changes (navigating between pages)
  useEffect(() => {
    if (location.pathname !== '/habits') {
      console.log(`useTodaysHabits - Location changed to ${location.pathname}, reprocessing habits`);
      processHabits();
    }
    
    // Listen for specific habit events
    const unsubscribeProcessed = eventBus.on('habits:processed', () => {
      console.log('useTodaysHabits - Received habits:processed event, updating habits');
      // Add a small delay to avoid collisions with other processes
      setTimeout(() => processHabits(), 50);
    });
    
    // Force an initial habit processing on mount (once)
    if (!initialProcessDoneRef.current) {
      const currentDate = timeUtils.getCurrentDateString();
      const timeout = setTimeout(() => {
        if (todaysHabits.length > 0 && lastProcessedDate !== currentDate) {
          console.log('Force scheduling habit tasks after initial load');
          scheduleHabitTasks(todaysHabits, currentDate);
          setLastProcessedDate(currentDate);
          initialProcessDoneRef.current = true;
        }
      }, 1000);
      
      return () => {
        unsubscribeProcessed();
        clearTimeout(timeout);
      };
    }
    
    return () => {
      unsubscribeProcessed();
    };
  }, [location, processHabits, todaysHabits, lastProcessedDate]);

  return { 
    todaysHabits, 
    refreshHabits: processHabits 
  };
};
