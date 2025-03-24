import { HabitLog } from '@/types/habit';
import { isSameDay, differenceInDays, parseISO } from 'date-fns';

/**
 * Computes the current streak for a habit based on its logs
 * @param logs Array of habit logs
 * @returns The current streak count
 */
export const computeHabitStreak = (logs: HabitLog[]): number => {
  if (!logs || logs.length === 0) return 0;

  // Sort logs by date in descending order (newest first)
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter to only completed logs
  const completedLogs = sortedLogs.filter((log) => log.completed);
  if (completedLogs.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(completedLogs[0].date);

  // Check if most recent log is from today or yesterday
  const today = new Date();
  const dayDiff = differenceInDays(today, currentDate);
  if (dayDiff > 1) return 0; // Streak broken if most recent completion is older than yesterday

  // Count consecutive days
  for (let i = 1; i < completedLogs.length; i++) {
    const prevDate = new Date(completedLogs[i].date);
    const diffDays = differenceInDays(currentDate, prevDate);

    if (diffDays === 1) {
      // Consecutive day
      streak++;
      currentDate = prevDate;
    } else if (diffDays > 1) {
      // Break in streak
      break;
    }
    // If diffDays === 0, it's the same day, so we don't count it again
  }

  return streak;
};
