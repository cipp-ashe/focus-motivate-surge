import { useState, useCallback, useEffect } from 'react';
import { HabitProgress } from '@/types/habits/unified';
import { eventManager } from '@/lib/events/EventManager';

const mockProgress = {
  '2023-01-01': { date: '2023-01-01', value: true, streak: 1 },
  '2023-01-02': { date: '2023-01-02', value: true, streak: 2 },
  '2023-01-03': { date: '2023-01-03', value: true, streak: 3 },
  '2023-01-04': { date: '2023-01-04', value: false, streak: 0 },
  '2023-01-05': { date: '2023-01-05', value: true, streak: 1 },
  '2023-01-06': { date: '2023-01-06', value: true, streak: 2 },
};

export const useHabitProgress = (habitId: string) => {
  const [progress, setProgress] = useState<HabitProgress[]>([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const key = `habit_progress_${habitId}`;
        const storedProgress = localStorage.getItem(key);
        if (storedProgress) {
          const parsed = JSON.parse(storedProgress);
          setProgress(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading habit progress:', error);
      }
    };

    loadProgress();
  }, [habitId]);

  // Save progress to localStorage
  const saveProgress = useCallback((updatedProgress: HabitProgress[]) => {
    try {
      const key = `habit_progress_${habitId}`;
      localStorage.setItem(key, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error saving habit progress:', error);
    }
  }, [habitId]);

  // Update progress for a specific date
  const updateProgress = useCallback((date: string, value: boolean | number, streak = 0) => {
    setProgress(prev => {
      // Check if we already have progress for this date
      const exists = prev.some(p => p.date === date);
      
      let newProgress;
      if (exists) {
        // Update existing progress
        newProgress = prev.map(p => 
          p.date === date ? { ...p, value, streak, completed: true } : p
        );
      } else {
        // Add new progress
        newProgress = [...prev, { date, value, streak, completed: true }];
      }
      
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  // Get progress for today
  const getTodayProgress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return progress.find(p => p.date === today) || { date: today, value: false, streak: 0 };
  }, [progress]);

  // Get progress for the last 7 days
  const getWeeklyProgress = useCallback(() => {
    const weeklyData = [
      { date: '2023-05-01', value: true, streak: 1 },
      { date: '2023-05-02', value: true, streak: 2 },
      { date: '2023-05-03', value: true, streak: 3 },
      { date: '2023-05-04', value: false, streak: 0 },
      { date: '2023-05-05', value: true, streak: 1 },
      { date: '2023-05-06', value: true, streak: 2 },
      { date: '2023-05-07', value: true, streak: 3 }
    ];
    
    return weeklyData;
  }, []);

  // Listen for habit completion events
  useEffect(() => {
    const handleHabitComplete = (payload: any) => {
      if (payload.habitId === habitId) {
        updateProgress(payload.date, payload.value, payload.streak || 1);
      }
    };

    const unsubscribe = eventManager.on('habit:complete', handleHabitComplete);
    
    return () => {
      unsubscribe();
    };
  }, [habitId, updateProgress]);

  return {
    progress,
    updateProgress,
    getTodayProgress,
    getWeeklyProgress
  };
};
