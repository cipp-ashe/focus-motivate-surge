
import { useState, useEffect } from 'react';
import { HabitDetail, HabitProgress } from '@/types/habits/types';

export interface HabitProgressResult {
  progress: HabitProgress[];
  streak: number;
  completion: number;
}

/**
 * Hook to get and track a habit's progress history
 */
export const useHabitProgress = (habit?: HabitDetail) => {
  const [progressData, setProgressData] = useState<HabitProgressResult>({
    progress: [],
    streak: 0,
    completion: 0
  });

  const getTodayProgress = (habitId: string, templateId: string) => {
    // Current implementation returns mock data
    return {
      value: false,
      streak: 0,
      date: new Date().toISOString().split('T')[0],
      completed: false,
    };
  };

  const updateProgress = (habitId: string, templateId: string, value: boolean | number) => {
    // This would be implemented to update the progress in storage
    console.log(`Updating progress for habit ${habitId} in template ${templateId} to ${value}`);
    return true;
  };

  const getWeeklyProgress = (habitId: string, templateId: string) => {
    // Return a week's worth of progress data
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weeklyData.push({
        date: date.toISOString().split('T')[0],
        completed: false,
        value: false
      });
    }
    
    return weeklyData;
  };

  // Load progress data for this habit
  useEffect(() => {
    if (!habit?.id) return;

    // This would typically come from a database or localStorage
    // For now, we'll create mock data
    const mockProgress: HabitProgress[] = [
      { date: new Date(Date.now() - 6 * 86400000).toISOString(), value: true },
      { date: new Date(Date.now() - 5 * 86400000).toISOString(), value: true },
      { date: new Date(Date.now() - 4 * 86400000).toISOString(), value: true },
      { date: new Date(Date.now() - 3 * 86400000).toISOString(), value: false },
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), value: true },
      { date: new Date(Date.now() - 1 * 86400000).toISOString(), value: true },
    ];

    // Calculate streak
    let currentStreak = 0;
    let maxStreak = 0;

    // Sort by date, most recent first
    const sortedProgress = [...mockProgress].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate current streak
    for (const entry of sortedProgress) {
      const value = typeof entry.value === 'boolean' ? entry.value : entry.value > 0;
      if (value) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate completion rate
    const completedDays = mockProgress.filter(
      p => typeof p.value === 'boolean' ? p.value : p.value > 0
    ).length;
    const completionRate = (completedDays / mockProgress.length) * 100;

    setProgressData({
      progress: mockProgress,
      streak: currentStreak,
      completion: completionRate
    });
  }, [habit?.id]);

  return {
    ...progressData,
    getTodayProgress,
    updateProgress,
    getWeeklyProgress
  };
};
