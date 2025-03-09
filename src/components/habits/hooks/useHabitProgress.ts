
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
    
    // CRITICAL: First check if there are relationships with notes for this habit
    // This ensures note relationships take precedence over stored progress
    const relatedNotes = relationshipManager.getRelatedEntities(habitId, 'habit', 'note');
    console.log(`Checking habit ${habitId} related notes:`, relatedNotes);
    const hasJournalEntry = relatedNotes.length > 0;
    
    // Check localStorage progress
    const storedProgress = progress[templateId]?.[habitId]?.[today];
    
    // If there's a journal entry, that always takes precedence - create a progress entry if needed
    if (hasJournalEntry) {
      if (!storedProgress || !storedProgress.completed) {
        // If we have a journal but no stored progress or it shows as incomplete, update it
        const journalProgress: HabitProgress = {
          value: true,
          streak: storedProgress?.streak ? storedProgress.streak + 1 : 1,
          date: today,
          completed: true,
        };
        
        // Update local state
        setProgress(prev => {
          const templateData = prev[templateId] || {};
          const habitData = templateData[habitId] || {};
          
          return {
            ...prev,
            [templateId]: {
              ...templateData,
              [habitId]: {
                ...habitData,
                [today]: journalProgress,
              },
            },
          };
        });
        
        return journalProgress;
      }
      return storedProgress;
    }
    
    // If there's stored progress but no journal entry, update stored progress to match reality
    if (storedProgress && storedProgress.completed && !hasJournalEntry) {
      const updatedProgress: HabitProgress = {
        value: false,
        streak: 0,
        date: today,
        completed: false,
      };
      
      // Update local state
      setProgress(prev => {
        const templateData = prev[templateId] || {};
        const habitData = templateData[habitId] || {};
        
        return {
          ...prev,
          [templateId]: {
            ...templateData,
            [habitId]: {
              ...habitData,
              [today]: updatedProgress,
            },
          },
        };
      });
      
      return updatedProgress;
    }
    
    // If there's stored progress and it matches the reality, return it
    if (storedProgress) {
      return storedProgress;
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

      // For each day, check if there are related notes directly
      const relatedNotes = relationshipManager.getRelatedEntities(habitId, 'habit', 'note');
      const hasJournalEntry = relatedNotes.length > 0;
      
      // Get the stored progress data
      const storedData = progress[templateId]?.[habitId]?.[dateStr];
      
      // If today and we have journal entries, they take precedence
      if (dateStr === today.toISOString().split('T')[0]) {
        if (hasJournalEntry) {
          weeklyProgress.push({
            value: true,
            streak: storedData?.streak || 1,
            date: dateStr,
            completed: true,
          });
        } else if (storedData) {
          // If stored data exists but no journal entries, adjust the completion status
          weeklyProgress.push({
            ...storedData,
            value: hasJournalEntry ? true : storedData.value,
            completed: hasJournalEntry ? true : storedData.completed,
          });
        } else {
          weeklyProgress.push({
            value: false,
            streak: 0,
            date: dateStr,
            completed: false,
          });
        }
      } else {
        // For past days, trust the stored data
        if (storedData) {
          weeklyProgress.push(storedData);
        } else {
          weeklyProgress.push({
            value: false,
            streak: 0,
            date: dateStr,
            completed: false,
          });
        }
      }
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
              streak: value ? streak + 1 : 0,
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
