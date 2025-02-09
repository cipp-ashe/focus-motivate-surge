import { useState, useCallback } from 'react';
import { TemplateProgress } from '../types';

export const useHabitProgress = () => {
  const [progress, setProgress] = useState<TemplateProgress>({});

  const getTodayProgress = useCallback((habitId: string, templateId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitProgress = progress[templateId]?.[habitId]?.[today];
    return {
      value: habitProgress?.value ?? false,
      streak: calculateStreak(progress[templateId]?.[habitId] || {}, today),
    };
  }, [progress]);

  const updateProgress = useCallback((habitId: string, templateId: string, value: boolean | number) => {
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();

    setProgress(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [habitId]: {
          ...prev[templateId]?.[habitId],
          [today]: {
            value,
            timestamp,
          },
        },
      },
    }));
  }, []);

  const calculateStreak = (habitProgress: Record<string, { value: boolean | number }>, today: string) => {
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const value = habitProgress[dateStr]?.value;

      if (value === true || (typeof value === 'number' && value > 0)) {
        streak++;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
      if (dateStr < today) break;
    }

    return streak;
  };

  return {
    getTodayProgress,
    updateProgress,
  };
};
