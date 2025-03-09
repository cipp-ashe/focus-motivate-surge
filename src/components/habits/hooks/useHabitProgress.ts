
import { useState, useEffect } from 'react';
import { HabitProgress } from '@/components/habits/types';
import { relationshipManager } from '@/lib/relationshipManager';

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
      console.log('Saved progress to localStorage:', progress);
    } catch (error) {
      console.error('Error saving habit progress to localStorage:', error);
    }
  }, [progress]);

  const getTodayProgress = (habitId: string, templateId: string): HabitProgress => {
    const today = new Date().toISOString().split('T')[0];
    
    // First check localStorage progress
    const storedProgress = progress[templateId]?.[habitId]?.[today];
    
    if (storedProgress) {
      return storedProgress;
    }
    
    // If not found in localStorage, check for relationships with notes as a fallback
    // This helps with syncing between notes and habits
    const relatedNotes = relationshipManager.getRelatedEntities(habitId, 'habit', 'note');
    
    if (relatedNotes.length > 0) {
      // If there are related notes, this habit should be marked as completed
      return {
        value: true,
        streak: 1, // Assume at least streak of 1
        date: today,
        completed: true,
      };
    }
    
    // Default return if nothing is found
    return {
      value: false,
      streak: 0,
      date: today,
      completed: false,
    };
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
      // Create a proper nested structure if it doesn't exist
      const templateData = prev[templateId] || {};
      const habitData = templateData[habitId] || {};
      
      const updated = {
        ...prev,
        [templateId]: {
          ...templateData,
          [habitId]: {
            ...habitData,
            [today]: {
              value,
              streak: value ? streak + 1 : streak,
              date: today,
              completed: Boolean(value),
            },
          },
        },
      };

      console.log(`Updated progress for habit ${habitId} in template ${templateId}:`, updated[templateId][habitId][today]);
      return updated;
    });
  };

  return {
    getTodayProgress,
    updateProgress,
    getWeeklyProgress,
  };
};
