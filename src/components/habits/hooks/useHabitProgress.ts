
import { useState, useEffect } from 'react';
import { HabitProgress } from '@/types/habits/unified';

export const useHabitProgress = (habitId: string) => {
  const [progress, setProgress] = useState<HabitProgress>({
    value: false,
    streak: 0
  });

  useEffect(() => {
    // Here you would typically fetch the progress from a database or local storage
    // For this example, we'll just simulate random progress
    const fetchProgress = () => {
      // Simulated progress data
      const streak = Math.floor(Math.random() * 10);
      const completed = Math.random() > 0.5;
      
      setProgress({
        value: completed,
        streak: streak,
        completed
      });
    };

    fetchProgress();
  }, [habitId]);

  return progress;
};
