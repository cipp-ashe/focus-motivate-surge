import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Habit, STORAGE_KEY } from '@/types/habits/types';
import { useHabitTaskProcessor } from '@/hooks/tasks/habitTasks/useHabitTaskProcessor';

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
  const { processPendingTasks } = useHabitTaskProcessor();

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

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'completed' | 'streak' | 'lastCompleted'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completed: false,
      streak: 0,
      lastCompleted: null,
    };
    
    saveHabits([newHabit, ...habits]);
    toast.success("New habit created!");
  }, [habits, saveHabits]);

  const toggleHabit = useCallback((habitId: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === habitId
        ? {
            ...habit,
            completed: !habit.completed,
            streak: habit.completed ? habit.streak - 1 : habit.streak + 1,
            lastCompleted: habit.completed ? null : new Date(),
          }
        : habit
    );
    
    saveHabits(updatedHabits);
    toast.success("Habit status updated!");
  }, [habits, saveHabits]);

  const deleteHabit = useCallback((habitId: string) => {
    const newHabits = habits.filter(habit => habit.id !== habitId);
    saveHabits(newHabits);
    toast.success("Habit deleted!");
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

  useEffect(() => {
    // When habits are loaded, check for pending tasks
    processPendingTasks();
  }, [habits, processPendingTasks]);

  return {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    updateHabit,
  };
}
