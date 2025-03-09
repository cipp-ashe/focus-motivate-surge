
import { useCallback } from 'react';

export const useHabitProgress = () => {
  const getTodayProgress = useCallback((habitId: string, templateId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressStorageKey = 'habit-progress';
      const progressData = JSON.parse(localStorage.getItem(progressStorageKey) || '{}');
      
      // Check if we have data for this template and habit
      if (progressData[templateId]?.[habitId]?.[today]) {
        return {
          value: progressData[templateId][habitId][today].value || false,
          streak: progressData[templateId][habitId][today].streak || 0,
          completed: progressData[templateId][habitId][today].completed || false
        };
      }
      
      // Return default values if no data exists
      return { value: false, streak: 0, completed: false };
    } catch (error) {
      console.error('Error getting habit progress:', error);
      return { value: false, streak: 0, completed: false };
    }
  }, []);

  const updateProgress = useCallback((habitId: string, templateId: string, value: boolean | number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressStorageKey = 'habit-progress';
      const progressData = JSON.parse(localStorage.getItem(progressStorageKey) || '{}');
      
      // Create nested structure if it doesn't exist
      if (!progressData[templateId]) {
        progressData[templateId] = {};
      }
      
      if (!progressData[templateId][habitId]) {
        progressData[templateId][habitId] = {};
      }
      
      const currentStreak = progressData[templateId][habitId][today]?.streak || 0;
      
      // Update progress
      progressData[templateId][habitId][today] = {
        value,
        streak: typeof value === 'boolean' && value ? currentStreak + 1 : currentStreak,
        date: today,
        completed: !!value
      };
      
      // Save back to localStorage
      localStorage.setItem(progressStorageKey, JSON.stringify(progressData));
      console.log(`Updated progress for habit ${habitId} in template ${templateId}:`, 
        progressData[templateId][habitId][today]);
        
      // Dispatch event to update UI
      window.dispatchEvent(new Event('habitProgressUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error updating habit progress:', error);
      return false;
    }
  }, []);

  const getTemplateProgress = useCallback((templateId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressStorageKey = 'habit-progress';
      const progressData = JSON.parse(localStorage.getItem(progressStorageKey) || '{}');
      
      // Return the entire template's progress for today
      return progressData[templateId]?.[today] || {};
    } catch (error) {
      console.error('Error getting template progress:', error);
      return {};
    }
  }, []);

  return {
    getTodayProgress,
    updateProgress,
    getTemplateProgress
  };
};
