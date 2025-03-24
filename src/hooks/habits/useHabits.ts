
/**
 * Consolidated Habit Hook
 * 
 * This hook combines the functionality from multiple habit-related hooks,
 * providing a unified API for habit management.
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { 
  Habit, 
  HabitDetail, 
  MetricType, 
  ActiveTemplate, 
  DayOfWeek, 
  STORAGE_KEY 
} from '@/types/habits';
import { formatDate } from '@/lib/utils/dateUtils';

// Helper function to parse stored habits
const parseStoredHabits = (storedHabits: string | null): Habit[] => {
  if (!storedHabits) return [];
  try {
    const parsed = JSON.parse(storedHabits);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing stored habits:', error);
    return [];
  }
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem(STORAGE_KEY);
    return parseStoredHabits(savedHabits);
  });
  
  // Load habits on mount and when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedHabits = localStorage.getItem(STORAGE_KEY);
      setHabits(parseStoredHabits(savedHabits));
    };

    window.addEventListener('habitsUpdated', handleStorageChange);
    return () => window.removeEventListener('habitsUpdated', handleStorageChange);
  }, []);

  const saveHabits = useCallback((newHabits: Habit[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
      window.dispatchEvent(new Event('habitsUpdated'));
    } catch (error) {
      console.error('Error saving habits:', error);
      toast.error('Failed to save habits. Please try again.');
    }
  }, []);

  // CRUD operations for habits
  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'completed' | 'streak' | 'lastCompleted'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      completed: false,
      streak: 0,
      lastCompleted: null,
    };
    
    saveHabits([newHabit, ...habits]);
    toast.success("New habit created!");
    return newHabit.id;
  }, [habits, saveHabits]);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, ...updates }
        : habit
    );
    
    saveHabits(updatedHabits);
    toast.success("Habit updated!");
  }, [habits, saveHabits]);

  const deleteHabit = useCallback((habitId: string) => {
    const newHabits = habits.filter(habit => habit.id !== habitId);
    saveHabits(newHabits);
    toast.success("Habit deleted!");
  }, [habits, saveHabits]);

  // Habit completion
  const completeHabit = useCallback((habitId: string, date: string, value: boolean | number = true) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) {
        console.error(`Habit with ID ${habitId} not found`);
        return false;
      }

      // Update habit streak and completion status
      const updatedHabits = habits.map(h => {
        if (h.id === habitId) {
          return {
            ...h,
            completed: true,
            streak: h.streak + 1,
            lastCompleted: new Date()
          };
        }
        return h;
      });

      saveHabits(updatedHabits);

      // Emit habit complete event
      eventManager.emit('habit:complete', {
        habitId,
        date,
        value,
        habitName: habit.name,
        metricType: habit.metrics?.type,
        templateId: habit.relationships?.templateId
      });

      return true;
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to complete habit');
      return false;
    }
  }, [habits, saveHabits]);

  const dismissHabit = useCallback((habitId: string, date: string) => {
    try {
      eventManager.emit('habit:dismiss', { habitId, date });
      return true;
    } catch (error) {
      console.error('Error dismissing habit:', error);
      return false;
    }
  }, []);

  // Templates integration
  const scheduleHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    duration: number,
    date: string,
    metricType?: MetricType
  ) => {
    eventManager.emit('habit:schedule', {
      habitId,
      templateId,
      name,
      duration,
      date,
      metricType
    });
  }, []);

  // Journal integration
  const openHabitJournal = useCallback((habitId: string, habitName: string, description?: string, templateId?: string) => {
    const today = formatDate(new Date());
    
    eventManager.emit('journal:open', {
      habitId,
      habitName,
      description,
      templateId,
      date: today
    });
  }, []);

  // Todays habits
  const getTodaysHabits = useCallback(() => {
    const today = new Date();
    const dayNames: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayName = dayNames[today.getDay()];
    
    // Filter habits that should be active today based on templates
    return habits.filter(habit => {
      // Implement your filtering logic based on templates and active days
      return true; // Placeholder
    });
  }, [habits]);

  return {
    // Core CRUD
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    
    // Habit completion
    completeHabit,
    dismissHabit,
    
    // Templates integration
    scheduleHabitTask,
    
    // Journal integration
    openHabitJournal,
    
    // Todays habits
    getTodaysHabits
  };
}
