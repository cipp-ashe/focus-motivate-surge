
import { useCallback, useEffect, useState, useRef } from 'react';
import { HabitDetail, DayOfWeek } from '@/components/habits/types';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { eventBus } from '@/lib/eventBus';

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

export const useTodaysHabits = () => {
  const { templates: activeTemplates } = useHabitState();
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const [lastProcessedDate, setLastProcessedDate] = useState<string>('');
  const processingRef = useRef(false);
  const processQueueRef = useRef<NodeJS.Timeout | null>(null);
  const processedTemplatesRef = useRef<Set<string>>(new Set());

  // Function to process habits - defined before use
  const processHabits = useCallback(() => {
    // Clear any pending process
    if (processQueueRef.current) {
      clearTimeout(processQueueRef.current);
      processQueueRef.current = null;
    }

    // If already processing, queue for later
    if (processingRef.current) {
      processQueueRef.current = setTimeout(processHabits, 100);
      return;
    }

    processingRef.current = true;
    
    try {
      if (!activeTemplates || activeTemplates.length === 0) {
        console.log("No active templates found to process");
        setTodaysHabits([]);
        return;
      }

      const today = timeUtils.getCurrentDayName();
      const currentDate = timeUtils.getCurrentDateString();
      
      console.log(`useTodaysHabits - Processing habits for ${today}, found ${activeTemplates.length} active templates`);

      // Keep track of processed template IDs to avoid duplicates
      processedTemplatesRef.current.clear();
      
      // Collect habits from active templates that are scheduled for today
      const habits: HabitDetail[] = [];
      const processedIds = new Set<string>();
      
      activeTemplates.forEach(template => {
        // Skip if we've already processed this template
        if (processedTemplatesRef.current.has(template.templateId)) {
          console.log(`Template ${template.templateId} already processed, skipping`);
          return;
        }
        
        processedTemplatesRef.current.add(template.templateId);
        
        const isActiveToday = template.activeDays?.includes(today);
        console.log(`Template ${template.templateId} active today: ${isActiveToday}, has ${template.habits?.length || 0} habits`);
        
        if (isActiveToday && template.habits && template.habits.length > 0) {
          template.habits.forEach(habit => {
            // Only add if we haven't processed this habit ID yet
            if (!processedIds.has(habit.id)) {
              processedIds.add(habit.id);
              const newHabit: HabitDetail = {
                ...habit,
                relationships: {
                  ...habit.relationships,
                  templateId: template.templateId
                }
              };
              habits.push(newHabit);
              
              // Get habit duration (default to 1500 seconds = 25 minutes)
              const habitDuration = 1500;
              
              // Determine the metric type from the metrics field
              let metricType = 'regular';
              if (habit.metrics && habit.metrics.type) {
                metricType = habit.metrics.type;
                console.log(`Found metric type for ${habit.name}: ${metricType}`);
              }
              
              // Immediately schedule this habit as a task
              console.log(`Scheduling habit task for ${habit.name} from template ${template.templateId} with duration ${habitDuration}, metric type ${metricType}`);
              eventBus.emit('habit:schedule', {
                habitId: habit.id,
                templateId: template.templateId,
                name: habit.name,
                duration: habitDuration,
                date: currentDate,
                metricType: metricType
              });
            }
          });
        }
      });
      
      console.log(`Processed ${habits.length} habits for today from ${processedTemplatesRef.current.size} templates`);
      setTodaysHabits(habits);
      setLastProcessedDate(currentDate);
      
      // Emit event that habits have been processed
      eventBus.emit('habits:processed', habits);
      
      // Force task updates with staggered timing
      [100, 300, 600].forEach(delay => {
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, delay);
      });
      
    } finally {
      processingRef.current = false;
    }
  }, [activeTemplates]);

  useEffect(() => {
    processHabits();
    
    // Set up an interval to check if the date has changed
    const checkDateInterval = setInterval(() => {
      const currentDate = timeUtils.getCurrentDateString();
      if (currentDate !== lastProcessedDate) {
        console.log('Date changed, reprocessing habits');
        processHabits();
      }
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(checkDateInterval);
      if (processQueueRef.current) {
        clearTimeout(processQueueRef.current);
      }
    };
  }, [processHabits, lastProcessedDate]);

  return { 
    todaysHabits,
    refreshHabits: processHabits
  };
};
