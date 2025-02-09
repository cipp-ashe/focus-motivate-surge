import { HabitProgress } from '@/components/habits/types';

export const getWeeklyProgress = (habitId: string, templateId: string): HabitProgress[] => {
  return [
    {
      value: true,
      streak: 1,
      date: new Date().toISOString(),
      completed: true
    }
  ];
};
