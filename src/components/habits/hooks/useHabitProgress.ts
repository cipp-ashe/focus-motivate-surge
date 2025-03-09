
import { useState, useEffect } from 'react';
import { HabitProgress } from '@/components/habits/types';

const PROGRESS_STORAGE_KEY = 'habit-progress';

export const useHabitProgress = () => {
  // Load initial progress from localStorage
  const [progress, setProgress] = useState<Record<string, Record<string, Record<string, HabitProgress>>>>(() => {
    try {
      const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return storedProgress ? JSON.parse(storedProgress) : {};
    } catch (error) {
      console.error('Error loading habit progress from localStorage:', error);
      return {};
    }
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving habit progress to localStorage:', error);
    }
  }, [progress]);

  const getTodayProgress = (habitId: string, templateId: string): HabitProgress => {
    const today = new Date().toISOString().split('T')[0];
    return (
      progress[templateId]?.[habitId]?.[today] || {
        value: false,
        streak: 0,
        date: today,
        completed: false,
      }
    );
  };

  const getWeeklyProgress = (habitId: string, templateId: string): HabitProgress[] => {
    const today = new Date();
    const weeklyProgress: HabitProgress[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      weeklyProgress.push(
        progress[templateId]?.[habitId]?.[dateStr] || {
          value: false,
          streak: 0,
          date: dateStr,
          completed: false,
        }
      );
    }

    return weeklyProgress;
  };

  const updateProgress = (habitId: string, templateId: string, value: boolean | number) => {
    const today = new Date().toISOString().split('T')[0];
    const currentProgress = progress[templateId]?.[habitId]?.[today];
    const streak = currentProgress?.streak || 0;

    setProgress((prev) => {
      const updated = {
        ...prev,
        [templateId]: {
          ...prev[templateId],
          [habitId]: {
            ...prev[templateId]?.[habitId],
            [today]: {
              value,
              streak: value ? streak + 1 : streak,
              date: today,
              completed: Boolean(value),
            },
          },
        },
      };

      return updated;
    });
  };

  return {
    getTodayProgress,
    updateProgress,
    getWeeklyProgress,
  };
};
