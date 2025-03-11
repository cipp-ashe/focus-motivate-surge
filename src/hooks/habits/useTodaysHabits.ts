
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
        setTodaysHabits([]);
        return;
      }

      const today = timeUtils.getCurrentDayName();
      const currentDate = timeUtils.getCurrentDateString();
      
      console.log(`useTodaysHabits - Processing habits for ${today}`);

      // Collect habits from active templates that are scheduled for today
      const habits: HabitDetail[] = [];
      const processedIds = new Set<string>();
      
      activeTemplates.forEach(template => {
        const isActiveToday = template.activeDays?.includes(today);
        
        if (isActiveToday && template.habits) {
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
            }
          });
        }
      });
      
      setTodaysHabits(habits);
      setLastProcessedDate(currentDate);
      
    } finally {
      processingRef.current = false;
    }
  }, [activeTemplates]);

  useEffect(() => {
    processHabits();
  }, [processHabits]);

  return { 
    todaysHabits,
    refreshHabits: processHabits
  };
};
